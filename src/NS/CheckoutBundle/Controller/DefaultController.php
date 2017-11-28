<?php

namespace NS\CheckoutBundle\Controller;

//use pour héritage du controller principal
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

//use pour les entitées
use NS\CheckoutBundle\Entity\Booking;
use NS\CheckoutBundle\Entity\Ticket;
use NS\CheckoutBundle\Entity\BookingTicket;

//use pour l'objet request
use Symfony\Component\HttpFoundation\Request;

//use pour le formulaire
use NS\CheckoutBundle\Form\BookingStepOneType;
use NS\CheckoutBundle\Form\BookingStepTwoType;
use NS\CheckoutBundle\Form\BookingStepThreeType;


class DefaultController extends Controller
{

    public function indexAction(Request $request)
    {
        // On redirige vers l'étape  4
        if($request->getSession()->get('step') == 'completed'){
            return $this->forward('NSCheckoutBundle:Default:stepFor');    
        }

        // On redirige vers l'étape 3 
        if($request->getSession()->get('step') == '3'){
            return $this->forward('NSCheckoutBundle:Default:stepThree');    
        }
        
        // On redirige vers l'étape 2
        if($request->getSession()->get('step') == '2'){
            return $this->forward('NSCheckoutBundle:Default:stepTwo');   
        }

        // On redirige vers l'étape 1
        return $this->forward('NSCheckoutBundle:Default:stepOne');
    }

    public function stepOneAction(Request $request)
    {
        $step = 1;
        $request->getSession()->set('step','1');
        // On crée un objet Booking
        $booking = new Booking();

        // On récupère l'entité manager et les repositories
        $em = $this->getDoctrine()->getManager();
        $repTicket = $em->getRepository('NSCheckoutBundle:Ticket');

        // On récupère les types de tickets
        $ticket = $repTicket->findOneByName('billet');

        // On crée le FormBuilder grâce au service form factory
        $form = $this
            ->createForm(BookingStepOneType::class, $booking)
            ->handleRequest($request);
         
        if ($form->isSubmitted() && $form->isValid()) {
            
            // On récupère les données du formulaire
            $booking = $form->getData();

            for ($i=0; $i < $booking->getSpaces() ; $i++) { 
                $bookingTicket = new BookingTicket();
                $bookingTicket->setTicket($ticket);
                $bookingTicket->setBooking($booking);
                $booking->addTicket($bookingTicket);
            } 

            $request->getSession()
                    ->set('booking', $booking);

            return $this->forward('NSCheckoutBundle:Default:stepTwo');
        }

        // Si le formulaire n'est ni soumis ni valide
        // --> On affiche la vue
        $form = $form->createView();
        return $this->render('NSCheckoutBundle:Default:stepOne.html.twig',compact(
            'step',
            'ticket',
            'form'
        ));
    } 

    public function stepTwoAction(Request $request)
    {
        $step = 2;
        $request->getSession()->set('step','2'); 

        // On récupère l'entité manager et les repositories
        $em = $this->getDoctrine()->getManager();
        $repBooking = $em->getRepository('NSCheckoutBundle:Booking');

        // On récupère l'objet booking enregistré en session
        $booking = $request->getSession()->get('booking');

        // Si l'objet booking enregistré en session a un ID
        // -->On récupère l'objet booking de la BDD correspondant
        if ($booking->getId()) {
            $booking = $repBooking->find($booking);
        }

        // On crée le FormBuilder grâce au service form factory
        $form = $this
            ->createForm(BookingStepTwoType::class, $booking)      
            ->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
            // On récupère le service
            // Et on traite les données avec ce service
            $upPricesBooking = $this->container->get('ns_checkout.services.up_prices_booking');
            $booking = $upPricesBooking->updatePrice($form->getData());
            
            $request->getSession()->set('booking', $booking);

            // Puis on enregistre les données en bdd avec le status 0
            $em->persist($booking);
            $em->flush($booking);

            return $this->forward('NSCheckoutBundle:Default:stepThree');     
        } 

        // Si le formulaire n'est ni soumis ni valid
        // On affiche la vue
        $form = $form->createView();
        return $this->render('NSCheckoutBundle:Default:stepTwo.html.twig', compact(
            'step',
            'booking',
            'form'
        ));
    }
    
    public function stepThreeAction(Request $request)
    {
        $step = 3; 
        $request->getSession()->set('step','3');
        
        // On récupère l'entité manager et les repositories
        $em = $this->getDoctrine()->getManager();
        $repBooking = $em->getRepository('NSCheckoutBundle:Booking');

        // On récupère l'objet booking enregistré en session
        $booking = $request->getSession()->get('booking');

        // Si l'objet booking enregistré en session a un ID
        // -->On récupère l'objet booking de la BDD correspondant
        if ($booking->getId()) {
            $booking = $repBooking->find($booking);
        }

        // On crée le FormBuilder grâce au service form factory
        $form = $this
            ->createForm(BookingStepThreeType::class, $booking,[
                'attr' => ['id'=>'booking_stepThree']
            ])     
            ->handleRequest($request);


        if ($form->isSubmitted() && $form->isValid()) {

            // On récupère les datas booking du formulaire
            $booking = $form->getData();

            $liveTime = $this->container->get('ns_checkout.services.live_time')
                                        ->validate($booking,20);
            if($liveTime != "true") return  $liveTime;           

            // On récupère le service stripe
            $stripe = $this->container->get('ns_checkout.services.stripe');

            // On vérifie si l'email exist déjà
            $hasMail = $repBooking->findOneBy([
                'userMail' => $booking->getUserMail(),
                'status'    => 1,
            ]);

            if (!$hasMail) {

                $customer = $stripe->api("customers",[
                    "source"      => $request->get("stripeToken"),
                    "description" => $request->get("booking_stepThree")["userName"],
                    "email"       => $booking->getUserMail()
                ]);

            } else {
                $customer = $stripe->api("customers/{$hasMail->getCustomerId()}",[
                    "source"      => $request->get("stripeToken")
                ]);
            }

            $charge = $stripe->api('charges',[
                "amount"   => $booking->getPrice() * 100,
                "currency" => 'eur',
                "customer" => $customer->id
            ]);
            
            // On modifie quelques valeurs du booking
            $booking->setStatus(1);
            $booking->setCustomerId($customer->id);

        
            // Puis on enregistre le booking en BDD 
            $em->flush($booking);

            // On récupère le service bookingMailer
            // Et on envoi un mail avec les coordonnées du booking
            $bookingMailer = $this->container->get('ns_checkout.services.booking_mailer');
            $bookingMailer->sendBookingSuccessMessage($booking);

            return $this->forward('NSCheckoutBundle:Default:stepFor');   
        }

        $form = $form->createView();
        return $this->render('NSCheckoutBundle:Default:stepThree.html.twig', compact(
            'step',
            'booking',
            'form'
        ));
    }

    public function stepForAction(Request $request)
    {
        $step = 4;
        $request->getSession()->set('step','4');
        
         // On récupère l'entité manager et les repositories
        $em = $this->getDoctrine()->getManager();
        $repBooking = $em->getRepository('NSCheckoutBundle:Booking');

        // On récupère l'objet booking enregistré en session puis on supprime la session
        $booking = $request->getSession()->get('booking');

        // Si l'objet booking enregistré en session a un ID
        // -->On récupère l'objet booking de la BDD correspondant
        if ($booking->getId()) {
            $booking = $repBooking->find($booking);
        }

        if($request->getSession()->get('step') == 'completed'){
            $this->container->get('ns_checkout.services.exit')->goAway();
            return $this->redirectToRoute('ns_ticketing_homepage');  
        }

        $request->getSession()->set('step','completed');
        return $this->render('NSCheckoutBundle:Default:stepFor.html.twig', compact(
            'step',
            'booking'
        ));
    }
}
