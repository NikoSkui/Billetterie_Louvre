<?php
// src/NS/CheckoutBundle/Services/ExitCheckoutService.php

namespace NS\CheckoutBundle\Services;

use Symfony\Component\HttpFoundation\Session\Session;

class ExitCheckoutService
{
  private $session;

  public function __construct(Session $session)
  {
      $this->session = $session;
  }

  public function goAway()
  {        
    $this->session->remove('booking');
    $this->session->remove('step');
  }
}