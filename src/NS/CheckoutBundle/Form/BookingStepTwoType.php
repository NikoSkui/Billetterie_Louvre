<?php

namespace NS\CheckoutBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

//use pour les chams de formulaire
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class BookingStepTwoType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            /*
            * Rappel :
            ** - 1er argument : nom du champ, ici « tickets », car c'est le nom de l'attribut
            ** - 2e argument : type du champ, ici « CollectionType » qui est une liste de quelque chose
            ** - 3e argument : tableau d'options du champ
            */
            ->add('tickets', CollectionType::class, array(
                'entry_type'   => BookingTicketType::class,
                'entry_options' => array('label' => false)
            ));
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'NS\CheckoutBundle\Entity\Booking'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'booking_stepTwo';
    }


}
