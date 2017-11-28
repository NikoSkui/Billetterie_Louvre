<?php
// src/NS/CheckoutBundle/Validator/Constraint/LiveTimeValidator.php

// Pas mis en palce, remplacé par le service LiveTime

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

// Use pour des services utilisés dans ce validator
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Component\HttpFoundation\RequestStack;
// use Symfony\Component\Routing\RouterInterface;

use Symfony\Component\HttpFoundation\RedirectResponse;

class LiveTimeValidator extends ConstraintValidator
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

  public function validate($value, Constraint $constraint)
  {
    if (null === $value || '' === $value) {
      return;
    }
    // Pour récupérer l'objet Request tel qu'on le connait, 
    // il faut utiliser getCurrentRequest du service request_stack
    $request = $this->requestStack->getCurrentRequest();

    $now = new \Datetime();
    
    $liveTime = clone $value;
    $liveTime->add(new \DateInterval('PT'.$constraint->minuteMax.'M'));    

    if ($now > $liveTime) {

      $this->context->buildViolation($constraint->message)
        ->setCode(LiveTime::LIMIT_TIME_ERROR)
        ->addViolation();

      // return new RedirectResponse(
      //   $this->router->generate('ns_ticketing_homepage')
      // );
    }

  }
}
