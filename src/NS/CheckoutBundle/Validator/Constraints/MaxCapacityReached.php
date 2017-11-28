<?php
// src/NS/CheckoutBundle/Validator/Constraints/MaxCapacityReached.php

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class MaxCapacityReached extends Constraint
{
    
    public $message = "La limite de place a été atteinte pour ce jour.";

    public function validatedBy()
    {
        return 'ns_checkout_max_capacity_reached'; // Ici, on fait appel à l'alias du service
    }
}
