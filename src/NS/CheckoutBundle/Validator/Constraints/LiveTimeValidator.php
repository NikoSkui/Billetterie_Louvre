<?php
// src/NS/CheckoutBundle/Validator/Constraint/LiveTimeValidator.php

// Pas mis en palce, remplacé par le service LiveTime

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

use Symfony\Component\HttpFoundation\RedirectResponse;

class LiveTimeValidator extends ConstraintValidator
{


  public function validate($value, Constraint $constraint)
  {
    if (null === $value || '' === $value) {
      return;
    }


    $now = new \Datetime();
    
    $liveTime = clone $value;
    $liveTime->add(new \DateInterval('PT'.$constraint->minuteMax.'M'));    

    if ($now > $liveTime) {

      $this->context->buildViolation($constraint->message)
        ->setCode(LiveTime::LIMIT_TIME_ERROR)
        ->addViolation();

    }

  }
}
