document.addEventListener( 'DOMContentLoaded', function () {
  if ($("[data-booking]")) {
    var booking = new Booking()
  }  
})

class Booking {
    constructor(selector, options) 
    {
      this.date
      this.isHalf
      this.spaces
      this.tickets = BookingTicket.create('[data-ticket]')
    }

}
