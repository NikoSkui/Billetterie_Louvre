document.addEventListener( 'DOMContentLoaded', function () {

  
  if (document.getElementById( 'datepicker' )) {

    var datePicker = new MyDatePicker( document.getElementById( 'datepicker' ), {
      lang: 'fr',
      onRender: function(e){
        e.open = true
      },
      onOpen: function(e) {
        if (document.querySelector("[data-remaining]").dataset.remaining === ''){   
          Ticket.updateRemaining()
        }
        if (e.ticketLouvre) {
          e.ticketLouvre.updateCalendar()
          e.ticketLouvre.updateHalfDay()
        }
      },
      onSelect: function(e) {
        var now = new Date()
        var today = now.getFullYear()+ '/' + (now.getMonth()+1) + '/' + now.getDate() 
        var daySelect = e.getFullYear()+ '/' + (e.getMonth()+1) + '/' + e.getDate() 
        var $selector = $('#booking_stepOne_half')
        var $spacesVal = $('#number-ticket').text()
        var $remainingElt = $("[data-fulldate='"+e.getDate()+ '/' + (e.getMonth()+1) + '/' + e.getFullYear() +"']")
        var $remainingVal = $remainingElt.attr('data-remaining')
        var btnMore = $('#ticket-billet .more')

        if ($remainingVal == $spacesVal ) {
          btnMore.removeClass('is-active')
          btnMore.addClass('is-disabled')
        } else {
          btnMore.addClass('is-active')
          btnMore.removeClass('is-disabled')       
        }
      
        if (now.getHours() >= 14
            && today == daySelect   
        ) {
          var $optionsToRemove = $selector.find('option[value="0"]')
          removeOptions($selector, $optionsToRemove)   
        } else {
          restoreOptions($selector)
        }
      }

    })
    var $selectedDate = $('#ticketDate').text()
    var dateTicket = new Date($selectedDate)

    if (dateTicket != 'Invalid Date') {
      addTicket()
    }

  }

  if ($('.checkout-steps__item--accessible')) {
    $('.checkout-steps__item--accessible').click(function(e){
          e.preventDefault()
          history.back()
    })
  }

})