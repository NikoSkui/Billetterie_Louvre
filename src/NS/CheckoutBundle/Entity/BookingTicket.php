<?php

namespace NS\CheckoutBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

// Use pour la validation de formulaire
use Symfony\Component\Validator\Constraints as Assert;

/**
 * BookingTicket
 *
 * @ORM\Table(name="ns_booking_ticket")
 * @ORM\Entity(repositoryClass="NS\CheckoutBundle\Repository\BookingTicketRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class BookingTicket
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
     * @ORM\Column(name="user_name", type="string", length=255)
     * @Assert\NotBlank(message="Vous devez saisir un nom et prénom")
     * @Assert\Type(
     *      type="string",
     *      message="Vous devez saisir une chaine de charactère"
     * )
     * @Assert\Length(
     *      min = 5,
     *      max = 200,
     *      minMessage ="Vous devez entrer au moins {{ limit }} charactères",
     *      maxMessage ="Vous devez entrer moins de {{ limit }} charactères"
     * )
     */
    private $userName;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=255)
     * @Assert\NotBlank(message="Vous devez choisir un pays")
     */
    private $country;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="birthday", type="date")
     * @Assert\NotBlank(message="Vous devez choisir une date d'anniversaire")
     * @Assert\Date(message="Le format n'est pas valide")
     */
    private $birthday;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_reduce", type="boolean")
     * @Assert\Type(type="bool")
     */
    private $isReduce;

    /**
     * @var string
     *
     * @ORM\Column(name="first_name", type="string", length=255)
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(name="last_name", type="string", length=255, nullable=true)
     */
    private $lastName;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=5, scale=2)
     */
    private $price;

    /**
     * Bidirectionnal - Many BookingTicket have One Booking . (OWNED SIDE)
     *
     * @ORM\ManyToOne(targetEntity="NS\CheckoutBundle\Entity\Booking", inversedBy="tickets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $booking;

    /**
     * Bidirectionnal - Many BookingTicket have One Ticket . (OWNED SIDE)
     *
     * @ORM\ManyToOne(targetEntity="NS\CheckoutBundle\Entity\Ticket", inversedBy="bookings")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ticket;


    // /**
    // * @ORM\PrePersist
    // */
    // public function increase()
    // {
    //     $this->getBooking()->increaseSpaces();
    // }

    // /**
    // * @ORM\PreRemove
    // */
    // public function decrease()
    // {
    //     $this->getBooking()->decreaseSpaces();
    // }

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
     * Set userName
     *
     * @param string $userName
     *
     * @return BookingTicket
     */
    public function setUserName($userName)
    {
        $this->userName = $userName;

        $partOfName = explode(' ',$userName,2);
        
        $this->setFirstName($partOfName[0]);
        if (isset($partOfName[1])) {
            $this->setLastName($partOfName[1]);
        } else {
            $this->setLastName('');            
        }

        return $this;
    }

    /**
     * Get userName
     *
     * @return string
     */
    public function getUserName()
    {
        return $this->userName;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return BookingTicket
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return BookingTicket
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set country
     *
     * @param string $country
     *
     * @return BookingTicket
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set birthday
     *
     * @param \DateTime $birthday
     *
     * @return BookingTicket
     */
    public function setBirthday($birthday)
    {
        $this->birthday = $birthday;

        return $this;
    }

    /**
     * Get birthday
     *
     * @return \DateTime
     */
    public function getBirthday()
    {
        return $this->birthday;
    }

    /**
     * Set isReduce
     *
     * @param boolean $isReduce
     *
     * @return BookingTicket
     */
    public function setIsReduce($isReduce)
    {
        $this->isReduce = $isReduce;

        return $this;
    }

    /**
     * Get isReduce
     *
     * @return boolean
     */
    public function getIsReduce()
    {
        return $this->isReduce;
    }

    /**
     * Set price
     *
     * @param string $price
     *
     * @return BookingTicket
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
     * Set booking
     *
     * @param \NS\CheckoutBundle\Entity\Booking $booking
     *
     * @return BookingTicket
     */
    public function setBooking(\NS\CheckoutBundle\Entity\Booking $booking)
    {
        $this->booking = $booking;

        return $this;
    }

    /**
     * Get booking
     *
     * @return \NS\CheckoutBundle\Entity\Booking
     */
    public function getBooking()
    {
        return $this->booking;
    }

    /**
     * Set ticket
     *
     * @param \NS\CheckoutBundle\Entity\Ticket $ticket
     *
     * @return BookingTicket
     */
    public function setTicket(\NS\CheckoutBundle\Entity\Ticket $ticket)
    {
        $this->ticket = $ticket;

        return $this;
    }

    /**
     * Get ticket
     *
     * @return \NS\CheckoutBundle\Entity\Ticket
     */
    public function getTicket()
    {
        return $this->ticket;
    }
}
