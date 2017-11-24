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
        'min'         => '12',
        'max'         => '60',
        'price'       => '16,00',
        'image'       => 'delacroix.jpg'],
      [
        'name'        => 'senior',
        'description' => 'Age: + 60ans',
        'min'         => '60',
        'max'         => '150',
        'price'       => '12,00',
        'image'       => 'laitiere.jpg'],
      [
        'name'        => 'enfant',
        'description' => 'Age: 4 - 12ans',
        'min'         => '4',
        'max'         => '12',
        'price'       => '8,00',
        'image'       => 'la-vierge-et-l-enfant.jpg'],
      [
        'name'        => 'bébé',
        'description' => 'Age: - 4ans',
        'min'         => '0',
        'max'         => '4',
        'price'       => '0,00',
        'image'       => ''],
      [
        'name'        => 'réduit',
        'description' => 'Présenter justificatif',
        'min'         => '',
        'max'         => '',
        'price'       => '10,00',
        'image'       => ''],
    ];

    foreach ($datas as $data) {
      // On crée le ticket
      $ticket = new Ticket();
      $ticket->setName($data['name']);
      $ticket->setDescription($data['description']);
      $ticket->setMin($data['min']);
      $ticket->setMax($data['max']);
      $ticket->setPrice($data['price']);
      $ticket->setImage($data['image']);
      
      // On la persiste
      $manager->persist($ticket);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }

}