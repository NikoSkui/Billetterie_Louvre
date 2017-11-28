<?php
// src/NS/CheckoutBundle/Validator/Constraints/LiveTime.php

// Pas mis en palce, remplacé par le service LiveTime

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Exception\MissingOptionsException;

/**
 * @Annotation
 */
class LiveTime extends Constraint
{
    
    const LIMIT_TIME_ERROR = 'liveTime';

    public $message = "Vous avez dépassé le temps imparti pour acheter les billets.";
    public $minuteMax;

    public function __construct($options = null)
    {
        if ($options !== null  && !is_array($options)) {
            $options = [
                'minuteMax' => $options,
            ];
        }

        parent::__construct($options);

        if ($this->minuteMax === null) {
            throw new MissingOptionsException(sprintf('L\'option "minuteMax" doit être donnée pour la contrainte %s', __CLASS__), ['max']);
        }
    }

    public function validatedBy()
    {
        return 'ns_checkout_live_time'; // Ici, on fait appel à l'alias du service
    }
}
