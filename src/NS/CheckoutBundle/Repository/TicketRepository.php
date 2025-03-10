<?php

namespace NS\CheckoutBundle\Repository;

/**
 * TicketRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TicketRepository extends \Doctrine\ORM\EntityRepository
{
  public function findByPrice ($price) {

    $qb = $this
      ->createQueryBuilder('t')

      ->where('t.price > :price')
      ->setParameter('price', $price);

    return $qb
      ->getQuery()
      ->getResult();
  }
  
  public function findAllTickets () {
    $qb = $this
      ->createQueryBuilder('t')

      ->where('t.min > :min')
      ->setParameter('min', 0)
      ->andwhere('t.max > :max')
      ->setParameter('max', 0);
    return $qb
      ->getQuery()
      ->getResult();
  }
}
