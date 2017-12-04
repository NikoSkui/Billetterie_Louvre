<?php

namespace NS\CheckoutBundle\Tests\Services;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\Tools\SchemaTool;

use \NS\CheckoutBundle\Services\UpPricesBookingService;
use NS\CheckoutBundle\Entity\Booking;
use NS\CheckoutBundle\Entity\BookingTicket;
use NS\CheckoutBundle\Entity\Ticket;

class UpPricesBookingServiceTest extends WebTestCase
{

  private $client;
  private $container;
  private $em;

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

    $ticket4 = new Ticket();
    $ticket4->setName('réduit') 
            ->setDescription('réduit')
            ->setImage('joconde.jpg')
            ->setPrice(10)
            ->setMin(0)
            ->setMax(0);

    $this->em->persist($ticket1);
    $this->em->persist($ticket2);
    $this->em->persist($ticket3);
    $this->em->persist($ticket4);
    $this->em->flush();

  }

  /**
   * @dataProvider birthdayForBookingPrice
   */
  public function testUpdatePriceWithGoodDate($type, $birthday, $reduce, $half, $price)
  {
    $upPricesBooking = new UpPricesBookingService($this->em);

    $bookingTicket = new BookingTicket();
    $bookingTicket->setUserName($type)
                  ->setBirthday($birthday)
                  ->setReduce($reduce);
    $booking = new Booking();
    $booking->setHalf($half)
            ->addTicket($bookingTicket);

    $result = $upPricesBooking->updatePrice($booking)->getPrice();

    $this->assertEquals($price, $result);

  }

  /**
   * @dataProvider exceptionBirthdayForBookingPrice
   */
  public function testUpdatePriceWithBadDate($type, $birthday, $reduce, $half, $message)
  {
      $upPricesBooking = new UpPricesBookingService($this->em);

      $bookingTicket = new BookingTicket();
      $bookingTicket->setUserName($type)
                    ->setBirthday($birthday)
                    ->setReduce($reduce);
      $booking = new Booking();
      $booking->setHalf($half)
              ->addTicket($bookingTicket);

      $this->expectExceptionMessage($message);

      $upPricesBooking->updatePrice($booking);

  }

  public function birthdayForBookingPrice()
  {
    return [
      ['normal', (new \DateTime())->sub(new \DateInterval('P12Y')), false,false,16 ],
      ['normal', (new \DateTime())->sub(new \DateInterval('P59Y')), false,true, 8  ],
      ['normal', (new \DateTime())->sub(new \DateInterval('P25Y')), true, false,10 ],
      ['normal', (new \DateTime())->sub(new \DateInterval('P25Y')), true, true, 5  ],
      ['senior', (new \DateTime())->sub(new \DateInterval('P60Y')), false,false,12 ],
      ['senior', (new \DateTime())->sub(new \DateInterval('P65Y')), false,true, 6  ],
      ['senior', (new \DateTime())->sub(new \DateInterval('P80Y')), true, false,10 ],
      ['senior', (new \DateTime())->sub(new \DateInterval('P119Y')),true, true, 5  ],
      ['enfant', (new \DateTime())->sub(new \DateInterval('P11Y')), false,false,8  ],
      ['enfant', (new \DateTime())->sub(new \DateInterval('P08Y')), false,true, 4  ],
      ['enfant', (new \DateTime())->sub(new \DateInterval('P11Y')), true, false,8  ],
      ['enfant', (new \DateTime())->sub(new \DateInterval('P04Y')), true, true, 4  ]
    ];

  }

  public function exceptionBirthdayForBookingPrice()
  {
    return[
      ['senior',(new \DateTime())->sub(new \DateInterval('P121Y')),true,true,'Vous êtes vraiment très très agé... Appelez-nous, nous allons organiser votre visite ensemble'  ],
      ['enfant',(new \DateTime())->sub(new \DateInterval('P03Y')), true,true,'Les enfants de moins de quatre ans ne payent pas l\'entrée'  ]
    ];
  }

}