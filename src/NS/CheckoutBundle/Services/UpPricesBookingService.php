<?php
// src/NS/CheckoutBundle/Services/UpBookingService.php

namespace NS\CheckoutBundle\Services;

use Doctrine\ORM\EntityManagerInterface;

use \NS\CheckoutBundle\Entity\Booking;

class UpPricesBookingService
{
  protected $em;

  public function __construct(EntityManagerInterface $entityManager)
  {
    $this->em = $entityManager;
  }

  public function updatePrice(Booking $booking)
  {
    $booking->resetPrice();
    
    $today = new \DateTime();
    
    // On récupère l'entité manager puis le répository
    $em = $this
        ->em
        ->getRepository('NSCheckoutBundle:Ticket');

    // On récupère les 3 types de tickets (4=<enfant<12, 12=<normal<60, 60=<senior>120)
    $typeOfTickets = $em->findAllTickets();
    // On récupère le ticket (réduit)
    $reduce = $em->findOneByName('réduit');

    // On boucle sur les billets du booking
    foreach ($booking->getTickets() as $bookingTicket) {

      // On calcul l'age de la personne en fonction de la date d'anniversaire
      $age = $today->diff($bookingTicket->getBirthday())->format('%y');

      // On boucle sur les types de tickets (enfant, normal, senior)
      foreach ($typeOfTickets as $type) {

        // On vérifie si l'age du billet du booking est compris entre ageMin/ageMax des types de tickets
        // --> Si Oui on SET la ref au type de ticket et le prix du billet
        if (($age >= $type->getMin() && $age < $type->getMax()) ) {

          $bookingTicket->setTicket($type);
          $bookingTicket->setPrice($type->getPrice());
        
        } elseif ($age < $type->getMin() && $type->getName() == 'enfant' ) {
          // On créer une exception si un billet à un age < à celui mini du billet enfant
          throw new \Exception('Les enfants de moins de quatre ans ne payent pas l\'entrée');
        } elseif ($age >= $type->getMax() && $type->getName() == 'senior' ) {
          // On créer une exception si un billet à un age > à celui maxi du billet senior
          throw new \Exception('Vous êtes vraiment très très agé... Appelez-nous, nous allons organiser votre visite ensemble');
        }
        
      }

      // On vérifie si le prix du billet du booking est inférieur au tarif réduit (cas du billet enfant)
      // --> Si Oui on SET le prix des tickets du booking (réduction à false) 
      if ($bookingTicket->getPrice() < $reduce->getPrice()) {
        $bookingTicket->setReduce(false);
      }

      // On vérifie si le billet du booking est réduit
      // --> Si Oui on SET le prix des tickets du booking  
      if ($bookingTicket->isReduce()) {
        $bookingTicket->setPrice($reduce->getPrice());
      }

      // On vérifie si le booking est à la demi-journée 
      // --> Si Oui on SET le prix des tickets du booking     
      if ($booking->isHalf()) {
        $bookingTicket->setPrice($bookingTicket->getPrice()/2);
      }

      // On INCREASE le prix total du booking    
      $booking->increasePrice($bookingTicket->getPrice());
    }

    return $booking;
  }
}
