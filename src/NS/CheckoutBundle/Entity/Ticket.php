<?php

namespace NS\CheckoutBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tickets
 *
 * @ORM\Table(name="ns_ticket")
 * @ORM\Entity(repositoryClass="NS\CheckoutBundle\Repository\TicketRepository")
 */
class Ticket
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=6, scale=2)
     */
    private $price;

    /**
    * Bidirectionnal - One Ticket has many BookingTicket. (INVERSE SIDE)
    *
    * @ORM\OneToMany(targetEntity="NS\CheckoutBundle\Entity\BookingTicket",cascade={"persist"}, mappedBy="ticket")
    */
    private $bookings;

  
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bookings = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Ticket
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Ticket
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set price
     *
     * @param string $price
     *
     * @return Ticket
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return string
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Add booking
     *
     * @param \NS\Checkout\Entity\BookingTicket $booking
     *
     * @return Ticket
     */
    public function addBooking(\NS\Checkout\Entity\BookingTicket $booking)
    {
        $this->bookings[] = $booking;

        return $this;
    }

    /**
     * Remove booking
     *
     * @param \NS\Checkout\Entity\BookingTicket $booking
     */
    public function removeBooking(\NS\Checkout\Entity\BookingTicket $booking)
    {
        $this->bookings->removeElement($booking);
    }

    /**
     * Get bookings
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getBookings()
    {
        return $this->bookings;
    }
}
