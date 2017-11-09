<?php

namespace NS\CheckoutBundle\Controller;

//use pour héritage du controller principal
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

//use pour les entitées
use NS\CheckoutBundle\Entity\Booking;
use NS\CheckoutBundle\Entity\Ticket;

//use pour l'objet request
use Symfony\Component\HttpFoundation\Request;

//use pour le formulaire
use NS\CheckoutBundle\Form\BookingType;

//use pour les chams de formulaire
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\CountryType;
use Symfony\Component\Form\Extension\Core\Type\DateType;


class DefaultController extends Controller
{

    public function indexAction(Request $request)
    {
        $step = 1;

        // On récupère l'entité manager
        $em = $this->getDoctrine()->getManager();

        // On crée un objet Booking
        $booking = new Booking();

        $tickets = $em
            ->getRepository('NSCheckoutBundle:Ticket')
            ->FindAll();

        // On crée le FormBuilder grâce au service form factory
        $form = $this->createForm(BookingType::class, $booking);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $datas = $form->getData();

            $tickets = array_filter($request->get('ns_checkoutbundle_booking'),function($key) {
                return in_array($key,['ticket-normal','ticket-senior','ticket-enfant']);
            },ARRAY_FILTER_USE_KEY);

            var_dump($tickets);
                    
            return $this->forward('NSCheckoutBundle:Default:particulars',compact(
                'step',
                'datas',
                'tickets'
            ));
        }
        $form = $form->createView();
        return $this->render('NSCheckoutBundle:Default:index.html.twig',compact(
            'step',
            'tickets',
            'form'
        ));
    }
    public function particularsAction($step, $datas,$tickets, Request $request)
    {
        $step ++;   
        
        $summary = [
            'selected_date' => new \DateTime(),
            'tickets' =>[

                [
                    'name'    => 'normal',
                    'priceUnitaire' => '16',
                    'nb' => 2,
                    'priceTotal' => 2*16,
                ],
                [
                    'name'    => 'senior',
                    'price' => '12',
                    'nb' => 2,
                    'priceTotal' => 2*12,
                ],
                [
                    'name'    => 'enfant',
                    'price' => '8',
                    'nb' => 1,
                    'priceTotal' => 1*8,
                ],
            ],
            'subtotal' => 16*2 + 12*2 + 8*1,
            'total' => 16*2 + 12*2 + 8*1
        ];       
        
        $form = $this->createFormBuilder()
            ->add('userName', TextType::class)       
            ->add('country', CountryType::class,[
                'preferred_choices' => array('FR')
            ])          
            ->add('birthday', DateType::class)          
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // data is an array with "name", "email", and "message" keys
            $datas = $form->getData();
            return $this->forward('NSCheckoutBundle:Default:payment',compact(
                'step',
                'summary'
            ));
            
            var_dump($datas);
            // $em->persist($datas);  
            
        }

        // var_dump($test);
        

        // if ($request->request->all() == 'POST') {
        // }
        $form = $form->createView();
        return $this->render('NSCheckoutBundle:Default:particulars.html.twig', compact(
            'step',
            'summary',
            'form'
        ));

    }
    public function paymentAction($step, $summary, Request $request)
    {
        if ($request->getMethod() == 'POST') {
            return $this->forward('NSCheckoutBundle:Default:confirmation',compact(
                'summary'
            ));
        }
        return $this->render('NSCheckoutBundle:Default:payment.html.twig', compact(
            'summary'
        ));
    }
    public function confirmationAction($summary, Request $request)
    {
        return $this->render('NSCheckoutBundle:Default:confirmation.html.twig', compact(
            'summary'
        ));
    }
}
