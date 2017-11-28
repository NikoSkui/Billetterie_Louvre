<?php
// src/NS/CheckoutBundle/Validator/Constraint/MaxCapacityReached.php

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

// Use pour des services utilisés dans ce validator
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class MaxCapacityReachedValidator extends ConstraintValidator
{
  private $requestStack;
  private $maxCapacity;
  private $em;

  // Les arguments déclarés dans la définition du service arrivent au constructeur
  // On doit les enregistrer dans l'objet pour pouvoir s'en resservir dans la méthode validate()
  public function __construct(RequestStack $requestStack,$maxCapacity, EntityManagerInterface $em)
  {
    $this->requestStack = $requestStack;
    $this->maxCapacity  = $maxCapacity;
    $this->em           = $em;
  }

  public function validate($spaces, Constraint $constraint)
  {
    // Pour récupérer l'objet Request tel qu'on le connait,
    // il faut utiliser getCurrentRequest du service request_stack
    $request = $this->requestStack->getCurrentRequest();
    $session = $request->getSession();
    
    // On récupère la date
    $date = $this->context->getRoot()->getData()->getDate();

    // On récupère le nb actuel enregisté
    $reached = $this->em
      ->getRepository('NSCheckoutBundle:booking')
      ->findNbTicketsForDate($date)
    ; 
    if ($session->get('booking')){
      $reached -= $session->get('booking')->getSpaces();
    } 
    $remaining = ($this->maxCapacity - $reached) > 0 ? ($this->maxCapacity - $reached): 0;

    // Si le nb de billets sélectionné est suppérieur au nb restant
    // --> on affiche un message d'erreur
    if ($spaces > $remaining) {

      $date = $date->format('d M. Y');

      if ($remaining === 0) {
          $message = "Il ne reste plus de billet disponnible à la vente pour le $date."; 
      } else {
        if ($remaining === 1) {
          $message = "Il ne reste plus que $remaining  billet disponnible à la vente pour le $date, vous tentez d'en acheter $spaces."; 
        } else {
          $message = "Il ne reste plus que $remaining  billets disponnibles à la vente pour le $date, vous tentez d'en acheter $spaces."; 
        }
      }

      $this
        ->context
        ->buildViolation($constraint->message)
        ->setParameters(['{{ message }}' => $message])
        ->addViolation()
      ;
    }
  }
}
