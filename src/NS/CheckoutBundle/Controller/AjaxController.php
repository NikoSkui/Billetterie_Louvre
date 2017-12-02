<?php

namespace NS\CheckoutBundle\Controller;

//use pour héritage du controller principal
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

//use pour les entitées
use NS\CheckoutBundle\Entity\Booking;

//use pour l'objet json response
use Symfony\Component\HttpFoundation\JsonResponse;
//use pour l'objet request
use Symfony\Component\HttpFoundation\Request;

class AjaxController extends Controller
{

  public function remainingAction ($daystart, $dayend, $month, $year)
  {
    // On récupère la capacité max
    $maxCapacity = $this->getParameter('ns_checkout.booking.max_tickets_by_day');

    // On récupère l'entité manager et les repositories
    $em = $this->getDoctrine()->getManager();
    $repBooking = $em->getRepository('NSCheckoutBundle:Booking');

    $nbDay = $dayend - $daystart;
    for ($i=0; $i < $nbDay+1 ; $i++) { 
      $day = $daystart + $i;
      if($day < 10) {
        $day = '0'.$day;
      }
      $fullDate = $day.'/'.$month.'/'.$year;
      $date = new \DateTime();
      $date = $date->setDate($year, $month, $day);

      // On récupère le nb actuel enregisté pour la date
      $reached = $repBooking->findNbTicketsForDate($date); 

      $remaining[$fullDate] = ($maxCapacity - $reached) > 0 ? ($maxCapacity - $reached): 0;
    }




    $result = compact('remaining');

    return new JsonResponse($result);
  }

}
