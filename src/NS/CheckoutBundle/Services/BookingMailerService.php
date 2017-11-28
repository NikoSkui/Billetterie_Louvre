<?php
// src/NS/CheckoutBundle/Services/BookingMailerService.php

namespace NS\CheckoutBundle\Services;

//use pour les entitées
use NS\CheckoutBundle\Entity\Booking;
//use pour le rendu
use Symfony\Component\Templating\EngineInterface;

class BookingMailerService
{
  /**
   * @var \Swift_Mailer
   */
  private $mailer;
  protected $templating;
  private $from = "3desquisse@gmail.com";
  private $reply = "contact@3desquisse.fr";
  private $name = "Billetterie du Louvre";

  public function __construct(\Swift_Mailer $mailer, EngineInterface $templating)
  {
    $this->mailer = $mailer;
    $this->templating = $templating;
  }

  public function sendMessage($to, $subject, $body)
  {
    $mail = (new \Swift_Message())
      ->setFrom($this->from,$this->name)
      ->setTo($to)
      ->setSubject($subject)
      ->setBody($body)
      ->setReplyTo($this->reply,$this->name)
      ->setContentType('text/html');

    $this->mailer->send($mail);
  }

  public function sendBookingSuccessMessage(Booking $booking){
    $subject = "Billetterie du Louvre : vos billets d'entrée pour le musée ";
    $template = 'NSCheckoutBundle:Mail:bookingSuccess.html.twig';
    $to = $booking->getUserMail();
    $body = $this->templating->render($template, compact('booking'));
    $this->sendMessage($to, $subject, $body);
  }
}
