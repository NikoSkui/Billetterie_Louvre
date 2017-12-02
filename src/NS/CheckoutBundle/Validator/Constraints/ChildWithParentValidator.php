<?php
// src/NS/CheckoutBundle/Validator/Constraint/ChildWithParentValidator.php

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

// Use pour des services utilisés dans ce validator
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ChildWithParentValidator extends ConstraintValidator
{
  private $em;

  // Les arguments déclarés dans la définition du service arrivent au constructeur
  // On doit les enregistrer dans l'objet pour pouvoir s'en resservir dans la méthode validate()
  public function __construct( EntityManagerInterface $em)
  {
    $this->em           = $em;
  }

  public function validate($value, Constraint $constraint)
  {
    
    if (null === $value[0] || '' === $value[0]) {
      return;
    }

    $adult = 0;

    $today = new \Datetime();

    // On récupère le ticket référence enfant
    // pour la contrainte d'âge Max
    $ticketRef = $this->em
      ->getRepository('NSCheckoutBundle:ticket')
      ->findOneByName('enfant')
    ;
    $ageMaxChild = $ticketRef->getMax();

    // On boucle sur les tickets
    foreach ($value as $bookingTicket) {

      // On calcule l'age en fonction de la date d'anniversaire du ticket
      $age = $today->diff($bookingTicket->getBirthday())->format('%y');

      if ($age >= $ageMaxChild) { $adult ++;}

    }

    // Si il n'y a pas d'adulte on déclenche l'erreur
    if ($adult == 0) {
      $this->context->addViolation($constraint->message);
    }
    
  }
}
