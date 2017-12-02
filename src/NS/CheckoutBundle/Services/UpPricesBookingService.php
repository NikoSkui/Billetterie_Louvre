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

    // On récupère les types de tickets
    $typeOfTickets = $em->findAllTickets();
    // On récupère le type de ticket 'réduction'
    $reduce = $em->findOneByName('réduit');

    // On boucle sur les tickets de la réservation
    foreach ($booking->getTickets() as $bookingTicket) {

      // On calcul l'age en fonction de la date d'anniversaire
      $age = $today->diff($bookingTicket->getBirthday())->format('%y');
      // On boucle sur les types de tickets
      foreach ($typeOfTickets as $type) {
        // On SET la ref au type de tickets et le prix suivant les contraintes ageMin/ageMax
        if (($age >= $type->getMin() && $age < $type->getMax()) ) {
          $bookingTicket->setTicket($type);
          $bookingTicket->setPrice($type->getPrice());
        } elseif ($age < $type->getMin() && $type->getName() == 'enfant' ) {
          throw new \Exception('Les enfants de moins de quatre ans ne payent pas l\'entrée');
        } elseif ($age >= $type->getMax() && $type->getName() == 'senior' ) {
          throw new \Exception('Vous êtes vraiment très très agé... Appelez-nous, nous allons organisez votre visite ensemble');
        }
      }

      // On vérifie si le prix du ticket est inférieur au tarif 
      // --> Si Oui on SET le prix des tickets du booking 
      if ($bookingTicket->getPrice() < $reduce->getPrice()) {
        $bookingTicket->setReduce(false);
      }

      // On vérifie si les tickets du booking sont réduits
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
