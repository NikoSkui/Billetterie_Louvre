<?php
// src/NS/CheckoutBundle/Services/ExitCheckoutService.php

namespace NS\CheckoutBundle\Services;

use Symfony\Component\HttpFoundation\Session\Session;

class ExitCheckoutService
{
  private $session;
  private $em;

  public function __construct(
    Session $session,
    \Doctrine\ORM\EntityManagerInterface $em
  ){
      $this->session = $session;
      $this->em = $em;
  }

  public function goAway()
  { 
    if(( $this->session->get('booking') 
      && $this->session->get('booking')->getId())
      && $this->session->get('step')
      && $this->session->get('step') !== 'completed'
    ) {
      $repBooking = $this->em->getRepository('NSCheckoutBundle:Booking');
      $booking = $repBooking->findOneById($this->session->get('booking')->getId());
      // On modifie quelques valeurs du booking
      $booking->setStatus(-2);
      // Puis on enregistre le booking en BDD 
      $this->em->flush($booking);
    }  

    $this->session->remove('booking');
    $this->session->remove('step');
  }
}
