<?php
// src/NS/CheckoutBundle/DataFixtures/ORM/LoadTicket.php

namespace NS\CheckoutBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;

use NS\CheckoutBundle\Entity\Ticket;

class LoadTicket
      extends AbstractFixture 
      implements FixtureInterface
{
  // Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
  public function load(ObjectManager $manager)
  {
    // Liste des noms de catégorie à ajouter
    $datas = [
      [
        'name'        => 'normal',
        'description' => 'Age : + 12ans',
        'price'       => '12,00'],
      [
        'name' => 'senior',
        'description' => 'Age: + 60ans',
        'price' => '12,00'],
      [
        'name' => 'enfant',
        'description' => 'Age: 4 - 12ans',
        'price' => '8,00']
    ];

    foreach ($datas as $data) {
      // On crée le ticket
      $ticket = new Ticket();
      $ticket->setName($data['name']);
      $ticket->setDescription($data['description']);
      $ticket->setPrice($data['price']);
      
      // On la persiste
      $manager->persist($ticket);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }

}