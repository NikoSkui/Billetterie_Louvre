<?php
// src/NS/CheckoutBundle/Services/UpBookingService.php

namespace NS\CheckoutBundle\Services;

use Doctrine\ORM\EntityManagerInterface;

class UpBookingService
{
  protected $em;

  public function __construct(EntityManagerInterface $entityManager)
  {
    $this->em = $entityManager;
  }

  public function Update($booking)
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

      // Si on ne trouve pas de date d'anniversaire
      // On créer des dates approximatives pour les tickets du booking
      if (!$bookingTicket->getBirthday()) {
        
        // On récupère les contraintes d'âge       
        $min = $bookingTicket->getTicket()->getMin();
        $max = $bookingTicket->getTicket()->getMax();
        // On calcul l'interval en fonction des contraintes
        $intervalYear = intval($min + (($max-$min)/3));
        $interval = new \DateInterval('P'.$intervalYear.'Y');
        // On clone la date du jour et on y soustrait l'interval
        $birthday = clone $today;
        $birthday->sub($interval);
        // On SET la date
        $bookingTicket->setBirthday($birthday);

      // Si on trouve une date d'anniversaire
      // On définie la référence au type de ticket des tickets du booking
      } else {

        // On calcul l'age en fonction de la date d'anniversaire
        $age = $today->diff($bookingTicket->getBirthday())->format('%y');
        // On boucle sur les types de tickets
        foreach ($typeOfTickets as $type) {
          // On SET la ref au type de tickets suivant les contraintes ageMin/ageMax
          if (($age >= $type->getMin() && $age < $type->getMax()) ) {
            $bookingTicket->setTicket($type);
          }
        }
      }

      // On SET le prix des tickets du booking
      $bookingTicket->setPrice($bookingTicket->getTicket()->getPrice());

      // On vérifie si le prix du ticket est inférieur au tarif 
      // --> Si Oui on SET le prix des tickets du booking 
      if ($bookingTicket->getPrice() < $reduce->getPrice()) {
        $bookingTicket->setIsReduce(false);
      }

      // On vérifie si les tickets du booking sont réduit
      // --> Si Oui on SET le prix des tickets du booking  
      if ($bookingTicket->getIsReduce()) {
        $bookingTicket->setPrice($reduce->getPrice());
      }
      // On vérifie si le booking est à la demi-journée 
      // --> Si Oui on SET le prix des tickets du booking     
      if ($booking->getIsHalf()) {
        $bookingTicket->setPrice($bookingTicket->getPrice()/2);
      }

      // On SET le prix total du booking    
      $booking->setPrice($bookingTicket->getPrice());
    }

    return $booking;
  }
}