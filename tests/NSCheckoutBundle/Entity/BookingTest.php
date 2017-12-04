<?php

namespace NS\CheckoutBundle\Tests\Entity;

//use pour les entitées
use NS\CheckoutBundle\Entity\Booking;
use NS\CheckoutBundle\Entity\Ticket;
use NS\CheckoutBundle\Entity\BookingTicket;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\Tools\SchemaTool;

class BookingTest extends WebTestCase
{
  
  private $client;
  private $container;
  private $em;
  private $booking;

  public function setUp()
  {
    parent::setUp();

    $this->client = static::createClient();

    $this->container = $this->client->getContainer();

    $this->em = $this->container->get('doctrine')->getManager();

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

    $repTicket = $this->em->getRepository('NSCheckoutBundle:Ticket');

    $ticket1 = new Ticket();
    $ticket1->setName('normal') 
            ->setDescription('+12 ans')
            ->setImage('delacroix.jpg')
            ->setPrice(16)
            ->setMin(12)
            ->setMax(60);

    $ticket2 = new Ticket();
    $ticket2->setName('senior') 
            ->setDescription('+60 ans')
            ->setImage('laitiere.jpg')
            ->setPrice(12)
            ->setMin(60)
            ->setMax(120);

    $ticket3 = new Ticket();
    $ticket3->setName('enfant') 
            ->setDescription('+4 ans -12ans')
            ->setImage('la-vierge-et-l-enfant.jpg')
            ->setPrice(8)
            ->setMin(4)
            ->setMax(12);

    $this->em->persist($ticket1);
    $this->em->persist($ticket2);
    $this->em->persist($ticket3);
    $this->em->flush();

    $bookingTicket1 = new BookingTicket();
    $bookingTicket1->setTicket($repTicket->findOneByName('enfant'))
                   ->setReduce(false)
                   ->setPrice(8);
    $bookingTicket2 = new BookingTicket();
    $bookingTicket2->setTicket($repTicket->findOneByName('normal'))
                   ->setReduce(false)
                   ->setPrice(16);
    $bookingTicket3 = new BookingTicket();
    $bookingTicket3->setTicket($repTicket->findOneByName('senior'))
                   ->setReduce(false)
                   ->setPrice(12);
    $bookingTicket4 = new BookingTicket();
    $bookingTicket4->setTicket($repTicket->findOneByName('normal'))
                   ->setReduce(true)
                   ->setPrice(10);
    $bookingTicket5 = new BookingTicket();
    $bookingTicket5->setTicket($repTicket->findOneByName('senior'))
                   ->setReduce(true)
                   ->setPrice(10);
    $bookingTicket6 = new BookingTicket();
    $bookingTicket6->setTicket($repTicket->findOneByName('enfant'))
                   ->setReduce(false)
                   ->setPrice(8);
    $bookingTicket7 = new BookingTicket();
    $bookingTicket7->setTicket($repTicket->findOneByName('enfant'))
                   ->setReduce(false)
                   ->setPrice(8);
    $bookingTicket8 = new BookingTicket();
    $bookingTicket8->setTicket($repTicket->findOneByName('senior'))
                   ->setReduce(true)
                   ->setPrice(10);

    $this->booking = new Booking();
    $this->booking->addTicket($bookingTicket1);
    $this->booking->addTicket($bookingTicket2);
    $this->booking->addTicket($bookingTicket3);
    $this->booking->addTicket($bookingTicket4);
    $this->booking->addTicket($bookingTicket5);
    $this->booking->addTicket($bookingTicket6);
    $this->booking->addTicket($bookingTicket7);
    $this->booking->addTicket($bookingTicket8);
  }

  public function testGetTicketsByType()
  {
    // Test 5 types de tickets
    $result = $this->booking->getTicketsByType();
    $this->assertCount(5, $result);

    return $result;
  }

  /**
   * @dataProvider priceForTicketsByType
   * @depends testGetTicketsByType
   */
  public function testGetTicketsPriceByType($price, $key, $type)
  {
    $result = $this->booking->getTicketsPriceByType($type[$key]);
    $this->assertEquals($price,$result);
  }

  public function priceForTicketsByType()
  {
    return [
      [24,0],
      [16,1],
      [12,2],
      [10,3],
      [20,4]
    ];
  }

}