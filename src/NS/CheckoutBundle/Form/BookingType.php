<?php

namespace NS\CheckoutBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

//use pour les chams de formulaire
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class BookingType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('date', HiddenType::class)
            ->add('userMail')
            ->add('isHalf')
            ->add('ticket-normal', HiddenType::class,[
                'mapped' => false
            ])
            ->add('ticket-senior', HiddenType::class,[
                'mapped' => false
            ])
            ->add('ticket-enfant', HiddenType::class,[
                'mapped' => false
            ]);

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
        return 'ns_checkoutbundle_booking';
    }


}
