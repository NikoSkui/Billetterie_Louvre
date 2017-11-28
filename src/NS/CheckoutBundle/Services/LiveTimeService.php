<?php
// src/NS/CheckoutBundle/Services/LiveTimeService.php

namespace NS\CheckoutBundle\Services;

use Symfony\Component\HttpFoundation\RedirectResponse;

class LiveTimeService
{
  private $requestStack;
  private $router;
  private $em;

  // Les arguments déclarés dans la définition du service arrivent au constructeur
  // On doit les enregistrer dans l'objet pour pouvoir s'en resservir dans la méthode validate()
  public function __construct(
    \Symfony\Component\HttpFoundation\RequestStack $requestStack, 
    \Symfony\Component\Routing\RouterInterface $router,
    \Doctrine\ORM\EntityManagerInterface $em
  ) {
    $this->requestStack = $requestStack;
    $this->router       = $router;
    $this->em           = $em;
  }

  public function validate($booking, $minuteMax)
  {

    // Pour récupérer l'objet Request tel qu'on le connait, 
    // il faut utiliser getCurrentRequest du service request_stack
    $request = $this->requestStack->getCurrentRequest();
    $session = $request->getSession();

    $now = new \Datetime();
    
    $liveTime = clone $booking->getCreatedAt();
    $liveTime->add(new \DateInterval('PT'.$minuteMax.'M'));    

    if ($now > $liveTime) {
        
      // On modifie quelques valeurs du booking
      $booking->setStatus(-1);
  
      // Puis on enregistre le booking en BDD 
      $this->em->flush($booking);

      $session->getFlashBag()->add(
          'danger',
          'Vous avez dépassé le temps imparti pour acheter les billets.'
      );

      return new RedirectResponse(
        $this->router->generate('ns_ticketing_homepage')
      );
    } else {
      return true;
    }

  }
}
