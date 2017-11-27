<?php

namespace NS\TicketingBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase; 

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertContains('My Ticket', $crawler->filter('nav a.navbar-item span')->text());
        $this->assertContains('My Ticket', $crawler->filter('title')->text());

    }
}
