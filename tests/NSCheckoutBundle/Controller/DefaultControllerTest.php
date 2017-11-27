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

    protected function setUp()
    {
        parent::setUp();

        $this->client = static::createClient();

        $this->container = $this->client->getContainer();

        $this->em = $this->container->get('doctrine')->getManager();

        // on récupère la session et on effectue des get ou set si besoin
        $this->session = $this->client->getContainer()->get('session');

        // Simuler enregistrement dans BDD
        // $this->em->getConnection()->beginTransaction();
        // $this->em->getConnection()->setAutoCommit(false);

        // Nettoyer la BDD TEST
        static $metadatas;

        if (!isset($metadatas)) {
            $metadatas = $this->em->getMetadataFactory()->getAllMetadata();
        }

        $schemaTool = new SchemaTool($this->em);
        $schemaTool->dropDatabase();

        if (!empty($metadatas)) {
            $schemaTool->createSchema($metadatas);
        }

        $ticket2 = new Ticket();
        $ticket2->setName('billet') 
                ->setDescription("'+12 ans -60 ans'") 
                ->setPrice(16)
                ->setImage('delacroix.jpg')
                ->setMin(12)
                ->setMax(60);

        $this->em->persist($ticket2);
        $this->em->flush();
    }

    public function testStepOne()
    {
        $ticket1 = new Ticket();
        $ticket1->setName('billet') 
                ->setDescription("Les billets sont nominatifs, à l'étape suivante n’oubliez pas d’indiquer le nom, prénom et date de naissance des visiteurs") 
                ->setPrice(0)
                ->setImage('joconde.jpg')
                ->setMin(0)
                ->setMax(0);
        $this->em->persist($ticket1);
        $this->em->flush();

        $this->session->set('step','1');
        $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-1', $responseContent);

        return $ticket1;

    }

    /**
     * @depends testStepOne
     */
    public function testStepTwo($ticket)
    {
        $booking = new Booking();
        $booking->setDate('20/11/2017')
                ->setSpaces(1)
                ->setIsHalf(false);
        $bookingTicket = new BookingTicket();
        $bookingTicket->setTicket($ticket)
                      ->setBooking($booking);
        $booking->addTicket($bookingTicket);

        $this->session->set('booking',$booking);

        $this->session->set('step','2');
        $crawler = $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-2', $responseContent);

        // Sélection basée sur la valeur, l'id ou le nom des boutons
        $form = $crawler->selectButton('stepButton')->form();
        $form['booking_stepTwo[tickets][0][userName]'] = 'Toto Tata';
        $form['booking_stepTwo[tickets][0][country]'] = 'FR';
        $form['booking_stepTwo[tickets][0][birthday][day]'] = '1';
        $form['booking_stepTwo[tickets][0][birthday][month]'] = '1';
        $form['booking_stepTwo[tickets][0][birthday][year]'] = '1985';
        $form['booking_stepTwo[tickets][0][isReduce]'] = false;

        $crawler = $this->client->submit($form);
        
        return $booking;

    }
    /** 
     * @depends testStepTwo
     */
    // public function testStepTwoSubmitValidData($booking)
    // {
    //     $this->session->set('step','2');
    //     $this->client->request('GET', '/checkout/');
    //     $formData = array(
    //         'username' => 'Toto tata',
    //         'country'  => 'France',
    //         'birthday' => '01/01/1985',
    //         'isReduce' => false
    //     );
    //     $formData = array(
    //         'test' => 'test',
    //         'test2' => 'test2',
    //     );

    //     $form = $this->factory->create(TestedType::class);

    //     $object = TestObject::fromArray($formData);

    //     // submit the data to the form directly
    //     $form->submit($formData);

    //     $this->assertTrue($form->isSynchronized());
    //     $this->assertEquals($object, $form->getData());

    //     $view = $form->createView();
    //     $children = $view->children;

    //     foreach (array_keys($formData) as $key) {
    //         $this->assertArrayHasKey($key, $children);
    //     }

    // }

    /**
     * @depends testStepTwo
     */
    public function testStepThree($booking)
    {
        $tickets = $booking->getTickets();
        foreach ($tickets as $bookingTicket) {
            $bookingTicket->setUserName('Toto tata')
                          ->setCountry('France')
                          ->setBirthday('01/01/1985')
                          ->setIsReduce(false);
        }

        $this->session->set('booking',$booking);

        $this->session->set('step','3');
        $this->client->request('GET', '/checkout/');

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('step-3', $responseContent);

    }

    protected function tearDown()
    {
        parent::tearDown();

        // $this->em->getConnection()->rollBack();
        $this->em->close();
        $this->em = null;

    }
}
