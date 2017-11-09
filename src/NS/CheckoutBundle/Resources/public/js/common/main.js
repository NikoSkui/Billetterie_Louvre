var normal = {name:'normal', price : 16,parent:true};
var senior = {name:'senior', price : 12,parent:true};
var enfant = {name:'enfant', price : 8, parent:false};

document.addEventListener( 'DOMContentLoaded', function () {
  if (document.getElementById( 'datepicker' )) {
    var datePicker = new MyDatePicker( document.getElementById( 'datepicker' ), {
      lang: 'fr'
    });
    var $selectedDate = $('#ticketDate').text();
    var dateTicket = new Date($selectedDate)

    if (dateTicket != 'Invalid Date') {
      addTicket();
    }
  }



  if ($('.checkout-steps__item--accessible')) {
    $('.checkout-steps__item--accessible').click(function(e){
          e.preventDefault();
          history.back();
    });
  }

});

function addTicket(tickets) {
  
  var tickets = [normal,senior,enfant]

  for (let ticket of tickets) {
    var newTicket = $( '#ticket-' + ticket.name )
    newTicket.removeClass('is-hidden');
    if (ticket.name != 'enfant') {
      newTicket.removeClass('is-disabled')
    }
    var ticketLouvre = new Ticket( newTicket, {
      price: ticket.price,
      parent: ticket.parent,
    });
  }
}