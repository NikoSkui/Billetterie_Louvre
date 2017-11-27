<?php

namespace NS\CheckoutBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

// Use pour la validation de formulaire
use Symfony\Component\Validator\Constraints as Assert;
// Use pour rajouter ses propres contraintes 
use NS\CheckoutBundle\Validator\Constraints as MyAssert;

/**
 * Booking
 *
 * @ORM\Table(name="ns_booking")
 * @ORM\Entity(repositoryClass="NS\CheckoutBundle\Repository\BookingRepository")
 * @ORM\HasLifecycleCallbacks()
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
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date")
     * @Assert\NotBlank(message="Vous devez sélectionner une date")
     * @Assert\DateTime(message="Le format n'est pas valide")
     */
    private $date;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_half", type="boolean")
     * @Assert\Type(
     *      type="bool",
     *      message="La valeur {{ value }} n'est pas un valide {{ type }}"
     * )
     */
    private $isHalf;

    /**
     * @var int
     *
     * @ORM\Column(name="spaces", type="integer")
     * @Assert\NotNull(message="Vous devez sélectionner au moins un ticket")
     * @Assert\Type(
     *      type="numeric",
     *      message="Vous devez saisir un nombre"
     * )
     * @Assert\GreaterThanOrEqual(
     *     message="Vous devez sélectionner au moins {{ compared_value }} ticket",
     *     value = 1
     * )
     * @MyAssert\MaxCapacityReached(message="{{ message }}")
     */
    private $spaces;

    /**
     * @var int
     *
     * @ORM\Column(name="status", type="integer")
     */
    private $status;

    /**
     * @var string
     *
     * @ORM\Column(name="user_mail", type="string", length=255, nullable=true)
     */
    private $userMail;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=5, scale=2)
     */
    private $price;
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var string
     *
     * @ORM\Column(name="customer_id", type="string", length=255, nullable=true)
     */
    private $customerId;

    /**
     * Bidirectionnal - One Booking has many BookingTicket. (INVERSE SIDE)
     *
     * @ORM\OneToMany(targetEntity="NS\CheckoutBundle\Entity\BookingTicket",cascade={"persist"}, mappedBy="booking")
     * @Assert\Valid()
     * @MyAssert\ChildWithParent()
     */
    private $tickets;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tickets = new \Doctrine\Common\Collections\ArrayCollection();
        $this->status = 0;
    }

    /**
    * @ORM\PrePersist
    */
    public function updateDate()
    {
        $this->setCreatedAt(new \Datetime());
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
     * Reset price
     *
     * @return Booking
     */
    public function resetPrice()
    {
        $this->price = 0;

        return $this;
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
     * Set price
     *
     * @param string $price
     *
     * @return Booking
     */
    public function increasePrice($price)
    {
        $this->price += $price;

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
        $this->date = \DateTime::createFromFormat('d/m/Y', $date);

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
     * @param \NS\CheckoutBundle\Entity\BookingTicket $ticket
     *
     * @return Booking
     */
    public function addTicket(\NS\CheckoutBundle\Entity\BookingTicket $ticket)
    {
        $this->tickets[] = $ticket;

        return $this;
    }

    /**
     * Remove ticket
     *
     * @param \NS\CheckoutBundle\Entity\BookingTicket $ticket
     */
    public function removeTicket(\NS\CheckoutBundle\Entity\BookingTicket $ticket)
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

    /**
     * Get tickets by type
     *
     * @return array
     */
    public function getTicketsByType()
    {
        foreach ($this->tickets as $ticket) {
            $array[] = $ticket;
        }

        $ticketsByType = array_filter($array, function($obj){
            static $nameList = [];
            $name = $obj->getTicket()->getName().$obj->getIsReduce();
            if(in_array($name,$nameList)) {
                return false;
            }
            $nameList [] = $name;
            return true;
        });
        return $ticketsByType;
    }

    /**
     * Get count of tickets by type
     *
     * @return array
     */
    public function getCount($typeOfTicket)
    {
        foreach ($this->tickets as $ticket) {
            $array[] = $ticket;
        }

        $typeOfTicket = $typeOfTicket->getTicket()->getName().$typeOfTicket->getIsReduce();

        $countTicketsByType = array_count_values(array_map(function ($ticket) {
            return $ticket->getTicket()->getName().$ticket->getIsReduce();
        }, $array));

        return $countTicketsByType[$typeOfTicket];
        
    }

    /**
     * Get price of tickets by type
     *
     * @return array
     */
    public function getTicketsPriceByType($typeOfTicket)
    {
        $NumberOfTicket = $this->getCount($typeOfTicket);
        return $NumberOfTicket * $typeOfTicket->getPrice();     
    }

    /**
     * Get reference of booking
     *
     * @return array
     */
    public function getReference()
    {
        $ref = 'B';
        $ref .= $this->getDate()->format('d');
        $ref .= substr($this->getId(),0,1);
        $ref .= '-';
        $ref .= substr($this->getId(),1,2);
        $ref .= substr($this->getDate()->format('y'),0,1);
        $ref .= '-';
        $ref .= substr($this->getDate()->format('ym'),1);
        $ref .= '-';
        $ref .= 'T';
        $ref .= 'P';
        $ref .= $this->getSpaces();
        $ref .= substr($this->getPrice(),0,2);

        return $ref;     
    }

    /**
     * Set customerId
     *
     * @param string $customerId
     *
     * @return Booking
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;

        return $this;
    }

    /**
     * Get customerId
     *
     * @return string
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Booking
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set spaces
     *
     * @param integer $spaces
     *
     * @return Booking
     */
    public function setSpaces($spaces)
    {
        $this->spaces = $spaces;

        return $this;
    }

    /**
     * Get spaces
     *
     * @return integer
     */
    public function getSpaces()
    {
        return $this->spaces;
    }

}
