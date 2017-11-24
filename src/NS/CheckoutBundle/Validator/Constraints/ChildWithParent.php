<?php
// src/NS/CheckoutBundle/Validator/Constraints/ChildWithParent.php

namespace NS\CheckoutBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Exception\MissingOptionsException;

/**
 * @Annotation
 */
class ChildWithParent extends Constraint
{
    
    public $message = "Un enfant ne peux pas acheter de billet si il n'est pas accompagné d'un adulte.";
    public $max = 1;

    public function __construct($options = null)
    {
        if ($options !== null  && !is_array($options)) {
            $options = [
                'max' => $options,
            ];
        }

        parent::__construct($options);

        if ($this->max === null) {
            throw new MissingOptionsException(sprintf('L\'option "max" doit être donnée pour la contrainte %s', __CLASS__), ['max']);
        }
    }

    public function validatedBy()
    {
        return 'ns_checkout_child_with_parent'; // Ici, on fait appel à l'alias du service
    }
}