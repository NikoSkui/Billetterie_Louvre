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
var Stripe
if (Stripe !== undefined) {
  // Create a Stripe client
  var stripe = Stripe('pk_test_8fWi3COBUMFME9SSpFHSNBr7')
  // Create an instance of Elements
  var elements = stripe.elements()

  // Custom styling can be passed to options when creating an Element.
  // (Note that this demo uses a wider set of styles than the guide below.)
  var style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }

  // Create an instance of the card Element
  var card = elements.create('card', {style: style})

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element')

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors')
    if (event.error) {
      displayError.classList.add('is-danger')
      displayError.textContent = event.error.message
    } else {
      displayError.textContent = ''
    }
  })

  // Handle form submission
  var form = document.getElementById('booking_stepThree')

  form.addEventListener('submit', function(event) {
    event.preventDefault()

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors')
        errorElement.textContent = result.error.message
      } else {
        // Send the token to your server
        console.log(result.token)
        stripeTokenHandler(result.token)
      }
    })
  })

  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('booking_stepThree')
    var hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', 'stripeToken')
    hiddenInput.setAttribute('value', token.id)
    form.appendChild(hiddenInput)

    // Submit the form
    form.submit()
  }
}

$(document).ready(function() {

    var createdAt = document.querySelector('[data-createdat]').dataset.createdat
    var liveTime = 20
    var endTime = new Date(createdAt)
    endTime.setMinutes(endTime.getMinutes() + liveTime)
    var minutes = $('#timer_minutes')
    var seconds = $('#timer_seconds')

    setDate()

    function setDate() {
      var now = new Date()
      // NON UTC
      // var s = ((endTime.getTime() - now.getTime())/1000)
      // UTC
      var s = ((endTime.getTime() - now.getTime())/1000) - now.getTimezoneOffset()*60

      var m = Math.floor(s/60) 
      minutes.html(m)
      s-= m * 60

      s = Math.floor(s) 
      seconds.html(s)

      if( m < 0 ) {
        var $inputMail = $('#booking_stepThree_userMail')
        var $inputName = $('#booking_stepThree_userName')
        $inputMail.val('timeelapsed@gmail.com')
        $inputName.val('error time')
        $( "#booking_stepThree" ).submit()
      }

      setTimeout(setDate,1000)

    }

})
