<?php

namespace NS\CheckoutBundle\Tests\Controller;
 
use NS\CheckoutBundle\Entity\Booking;
use NS\CheckoutBundle\Entity\BookingTicket;
use NS\CheckoutBundle\Entity\Ticket;


use Doctrine\ORM\Tools\SchemaTool;

// use Symfony\Component\HttpFoundation\Session\Session;
// use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    private $client;
    private $container;
    private $em;
    private $session;
    private $ticketNeutre;

    protected function setUp()
    {
        parent::setUp();

        $this->client = static::createClient();

        $this->container = $this->client->getContainer();

        $this->em = $this->container->get('doctrine')->getManager();

        // on récupère la session et on effectue des get ou set si besoin
        $this->session = $this->client->getContainer()->get('session');

        // Nettoyer la BDD TEST
        // static $metadatas;

        // if (!isset($metadatas)) {
        //     $metadatas = $this->em->getMetadataFactory()->getAllMetadata();
        // }

        // $schemaTool = new SchemaTool($this->em);
        // $schemaTool->dropDatabase();

        // if (!empty($metadatas)) {
        //     $schemaTool->createSchema($metadatas);
        // }

        $this->ticket = new Ticket();
        $this->ticket->setName('billet') 
                            ->setDescription("Les billets sont nominatifs, à l'étape suivante n’oubliez pas d’indiquer le nom, prénom et date de naissance des visiteurs") 
                            ->setPrice(0)
                            ->setImage('joconde.jpg')
                            ->setMin(0)
                            ->setMax(0);

        $normal = new Ticket();
        $normal->setName('normal') 
                ->setDescription("'+12 ans -60 ans'") 
                ->setPrice(16)
                ->setImage('delacroix.jpg')
                ->setMin(12)
                ->setMax(60);

        $senior = new Ticket();
        $senior->setName('senior') 
                ->setDescription("'+12 ans -60 ans'") 
                ->setPrice(12)
                ->setImage('delacroix.jpg')
                ->setMin(60)
                ->setMax(120);

        $enfant = new Ticket();
        $enfant->setName('enfant') 
                ->setDescription("'+12 ans -60 ans'") 
                ->setPrice(8)
                ->setImage('delacroix.jpg')
                ->setMin(4)
                ->setMax(12);

        $ticket4 = new Ticket();
        $ticket4->setName('réduit') 
                ->setDescription('réduit') 
                ->setPrice(10)
                ->setImage('joconde.jpg')
                ->setMin(0)
                ->setMax(0);

        $this->em->persist($normal);
        $this->em->persist($senior);
        $this->em->persist($enfant);
        $this->em->persist($ticket4);
        $this->em->persist($this->ticket);
        $this->em->flush();
    }

    public function testStepOne()
    {
        
        $this->session->set('step','1');
        $crawler = $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-1', $responseContent);

        // Sélection basée sur la valeur, l'id ou le nom des boutons
        $form = $crawler->selectButton('stepButton')->form([
            'booking_stepOne[date]' => '29/11/2017',
            'booking_stepOne[spaces]' => '1',
        ]);

        $this->client->submit($form);

        $booking = new Booking();
        $booking->setDate('29/11/2017')
                ->setSpaces(1)
                ->setIsHalf(false);
        $bookingTicket = new BookingTicket();
        $bookingTicket->setTicket($this->ticket)
                      ->setBooking($booking);
        $booking->addTicket($bookingTicket);

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertContains('step-2', $responseContent);

        return $booking;

    }

    /**
     * @depends testStepOne
     */
    public function testStepTwo($booking)
    {

        $this->session->set('step','2');
        $this->session->set('booking',$booking);
        $crawler = $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-2', $responseContent);

        // Sélection basée sur la valeur, l'id ou le nom des boutons
        $form = $crawler->selectButton('stepButton')->form([
            'booking_stepTwo[tickets][0][userName]'        => 'Toto Tata',
            'booking_stepTwo[tickets][0][country]'         => 'FR',
            'booking_stepTwo[tickets][0][birthday][day]'   => '1',
            'booking_stepTwo[tickets][0][birthday][month]' => '1',
            'booking_stepTwo[tickets][0][birthday][year]'  => '1985',
            'booking_stepTwo[tickets][0][isReduce]'        => false,
        ]);

        $this->client->submit($form);

        $repTicket = $this->em->getRepository('NSCheckoutBundle:Ticket');
        $ticket = $repTicket->findOneByName('normal');
        $bookingTickets = $booking->getTickets();
        foreach ($bookingTickets as $bookingTicket) {
            $bookingTicket->setUserName('Toto tata')
                          ->setCountry('FR')
                          ->setBirthday(new \DateTime('01/01/1985'))
                          ->setIsReduce(false)
                          ->setPrice(16)
                          ->setTicket($ticket);
        }
        $booking->setPrice(16);

        $this->em->persist($booking);
        $this->em->flush();

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertContains('step-3', $responseContent);
        
        return $booking;

    }

    /**
     * @depends testStepTwo
     */
    public function testStepThree($booking)
    {
        $this->session->set('booking',$booking);
        $this->session->set('step','3');
        $crawler = $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-3', $responseContent);

        // Sélection basée sur la valeur, l'id ou le nom des boutons
        $form = $crawler->selectButton('stepButton')->form([
            'booking_stepThree[userMail]'        => 'toto@gmail.fr',
            'booking_stepThree[userName]'         => 'toto tata',
        ]);

        $this->client->submit($form);

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertContains('step-3', $responseContent);

        return $booking;

    }

    /**
     * @depends testStepThree
     */
    public function testStepFor($booking)
    {
        $this->session->set('booking',$booking);
        $this->session->set('step','completed');
        $crawler = $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-4', $responseContent);
    }

    protected function tearDown()
    {
        parent::tearDown();
        $this->em->close();
        $this->em = null;

    }
}
