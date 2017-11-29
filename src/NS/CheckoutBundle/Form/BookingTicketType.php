<?php

namespace NS\CheckoutBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

//use pour les chams de formulaire
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CountryType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class BookingTicketType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('userName',TextType::class)
            ->add('country',CountryType::class,[
                'preferred_choices' => ['FR']
            ])
            ->add('birthday',BirthdayType::class,[
                'years' => range(date('Y')-120, date('Y')-4),   
                'placeholder' => [
                    'year'  => '--',
                    'month' => '--',
                    'day'   => '--',
                ],
            ])
            ->add('reduce',CheckboxType::class, [
                'required' => false,
            ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'NS\CheckoutBundle\Entity\BookingTicket'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'ns_checkoutbundle_bookingticket';
    }


}
