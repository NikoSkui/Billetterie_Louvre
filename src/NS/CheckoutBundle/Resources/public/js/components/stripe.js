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
