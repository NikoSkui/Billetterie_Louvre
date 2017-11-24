<?php

namespace NS\CheckoutBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

//use pour les chams de formulaire
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

//use pour les validations du formulaire
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Email;


class BookingStepThreeType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('userMail',TextType::class,[ // pour test => TextType sinon EmailType
                'required'=>false, // pour test 
                'attr' => [
                    'class' => 'input is-medium'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => "Vous devez saisir un email"
                    ]),
                    new Email([
                        'message' => "L'email {{ value }} n'est pas valide",
                        'checkMX' => true
                    ])
                ]
            ])           
            ->add('userName',TextType::class,[
                'required'=>false,// pour test 
                'mapped' => false,
                'constraints' => [
                    new NotBlank([
                        'message' => "Vous devez saisir le nom inscrit sur votre carte bancaire"
                    ])
                ]
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
        return 'booking_stepThree';
    }


}
