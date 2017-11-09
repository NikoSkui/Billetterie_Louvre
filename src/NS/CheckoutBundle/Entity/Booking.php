<?php

namespace NS\CheckoutBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Booking
 *
 * @ORM\Table(name="ns_booking")
 * @ORM\Entity(repositoryClass="NS\CheckoutBundle\Repository\BookingRepository")
 */
class Booking
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
     * @ORM\Column(name="price", type="decimal", precision=5, scale=2)
     */
    private $price;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date")
     */
    private $date;

    /**
     * @var int
     *
     * @ORM\Column(name="status", type="integer")
     */
    private $status;

    /**
     * @var string
     *
     * @ORM\Column(name="user_mail", type="string", length=255)
     */
    private $userMail;
    
    /**
     * @var bool
     *
     * @ORM\Column(name="is_half", type="boolean")
     */
    private $isHalf;

    // /**
    //  * @var int
    //  *
    //  */
    // private $normalTicket;

    // /**
    //  * @var int
    //  *
    //  */
    // private $seniorTicket;

    // /**
    //  * @var int
    //  *
    //  */
    // private $childTicket;
    /**
    
    * Bidirectionnal - One Booking has many BookingTicket. (INVERSE SIDE)
    *
    * @ORM\OneToMany(targetEntity="NS\CheckoutBundle\Entity\BookingTicket",cascade={"persist"}, mappedBy="booking")
    */
    private $tickets;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tickets = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set price
     *
     * @param string $price
     *
     * @return Booking
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
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Booking
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set status
     *
     * @param integer $status
     *
     * @return Booking
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set userMail
     *
     * @param string $userMail
     *
     * @return Booking
     */
    public function setUserMail($userMail)
    {
        $this->userMail = $userMail;

        return $this;
    }

    /**
     * Get userMail
     *
     * @return string
     */
    public function getUserMail()
    {
        return $this->userMail;
    }

    /**
     * Set isHalf
     *
     * @param boolean $isHalf
     *
     * @return Booking
     */
    public function setIsHalf($isHalf)
    {
        $this->isHalf = $isHalf;

        return $this;
    }

    /**
     * Get isHalf
     *
     * @return boolean
     */
    public function getIsHalf()
    {
        return $this->isHalf;
    }

    /**
     * Add ticket
     *
     * @param \NS\Checkout\Entity\BookingTicket $ticket
     *
     * @return Booking
     */
    public function addTicket(\NS\Checkout\Entity\BookingTicket $ticket)
    {
        $this->tickets[] = $ticket;

        return $this;
    }

    /**
     * Remove ticket
     *
     * @param \NS\Checkout\Entity\BookingTicket $ticket
     */
    public function removeTicket(\NS\Checkout\Entity\BookingTicket $ticket)
    {
        $this->tickets->removeElement($ticket);
    }

    /**
     * Get tickets
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTickets()
    {
        return $this->tickets;
    }
}
