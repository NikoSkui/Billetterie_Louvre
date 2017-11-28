<?php

namespace NS\TicketingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

//use pour l'objet request
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function indexAction(Request $request)
    {
        $session = $request->getSession();
        $session->getFlashBag()->add(
            'danger',
            'Vous avez dépassé le temps imparti pour acheter les billets.'
        );
        $this->container->get('ns_checkout.services.exit')->goAway();

        return $this->render('NSTicketingBundle:Default:index.html.twig');
    }
}
