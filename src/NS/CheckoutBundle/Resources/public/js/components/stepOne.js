document.addEventListener( 'DOMContentLoaded', function () {
  Ticket.updateRemaining()
})

class Ticket {

  constructor(selector, options) {

    if (!options) options = {};
    var defaultOptions = {
      nbMax: 9,
      moment: 'Journée',
      fields: [],
    };

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }
    this.id = this.element.attr('id')
    this.eltNbTicket = this.element.find('#number-ticket');
    this.parentNbTicket = this.eltNbTicket.parent();
    this.eltTypeOfTicket = this.element.find('#typeOfTicket');
    this.eltPrice = this.element.find('#price');
    this.btnMore = this.element.find('.more');
    this.btnLess = this.element.find('.less');
    this.remainingTicket = 0
    this.nbTicket = 0

    this.options = Object.assign({}, defaultOptions, options);
  
    this.build();
  }

  build() {
    var _this = this;
    var $elementFormspaces = $('#booking_stepOne_spaces');
    var inputValue = document.getElementById('booking_stepOne_spaces').value;

    if(inputValue) {

      var childTicket = $('#ticket-enfant');
      childTicket.removeClass('is-disabled');
      childTicket.find('.more').addClass('is-active');
      childTicket.find('#number-ticket').removeClass('has-text-white');

      if (_this.nbTicket > 0 ) {
        _this.btnLess.removeClass('is-disabled');
        _this.btnLess.addClass('is-active');
        _this.eltNbTicket.parent().addClass('is-link-background');
        _this.eltNbTicket.addClass('has-text-white');
      }

      if (_this.nbTicket > 5 ) {
        _this.btnMore.removeClass('is-active');
        _this.btnMore.addClass('is-disabled');
      }

      for (var i = 0; i < _this.nbTicket; i++) {
        updateCard(_this.id, _this.nbTicket);
      }

      _this.eltNbTicket.text(_this.nbTicket);

    }
      
    this.btnMore.click(function (e) {

      e.preventDefault();

      if (_this.nbTicket < _this.remainingTicket 
         && _this.nbTicket < _this.options.nbMax 
      ) {

        _this.nbTicket ++;
        $elementFormspaces.val(_this.nbTicket); 

        if (_this.nbTicket > 0 ) {
          _this.btnLess.removeClass('is-disabled');
          _this.btnLess.addClass('is-active');
          _this.eltNbTicket.parent().addClass('is-link-background');
          _this.eltNbTicket.addClass('has-text-white');
        }

        if ( _this.nbTicket > _this.options.nbMax   - 1 
          || _this.nbTicket > _this.remainingTicket - 1 
        ) {
          _this.btnMore.removeClass('is-active');
          _this.btnMore.addClass('is-disabled');
        }

        _this.updateCalendar();
        updateCard(_this.id, _this.nbTicket);
        _this.eltNbTicket.text(_this.nbTicket);
        
      }

    });

    this.btnLess.click(function (e) {

      e.preventDefault();

      if ( _this.nbTicket > 0 ) {
          
        _this.nbTicket --;
        $elementFormspaces.val(_this.nbTicket); 

        if (_this.nbTicket == 0 ) {
          _this.btnLess.removeClass('is-active');
          _this.btnLess.addClass('is-disabled');
          _this.eltNbTicket.parent().removeClass('is-link-background');
          _this.eltNbTicket.removeClass('has-text-white');
        }
        if ( _this.nbTicket <= _this.options.nbMax - 1 
           || _this.nbTicket <= _this.remainingTicket -1 
        ) {
          _this.btnMore.addClass('is-active');
          _this.btnMore.removeClass('is-disabled');
        }

        _this.updateCalendar();
        _this.eltNbTicket.text(_this.nbTicket);
        updateCard(_this.id, _this.nbTicket);

      }

    });

    function updateCard(id, nbTicket) {

      var $ticketResume = $('#ticket-resume');
      var $elementCible = $('#'+id+'-resume');
      var $elementFormCible = $('#booking_stepOne_'+id);

      var content = nbTicket + 'x ' + _this.eltTypeOfTicket.text();
      if (nbTicket>1){
        content += 's';
      }
      var moment = _this.options.moment;

      var summaryContainer = createElement('div','columns is-gapless is-marginless',null,id);
      var summaryContent = createElement('div','column is-two-thirds is-size-7', content);
      var summaryPrice = createElement('div','column is-size-7',moment,'isHalf');

      summaryContainer.appendChild(summaryContent);
      summaryContainer.appendChild(summaryPrice);

      $elementFormCible.val(nbTicket);       

      updateTotal(nbTicket);

      if(nbTicket > 0) {
        if($elementCible.length > 0) {
          $elementCible.replaceWith(summaryContainer);
        } else {
          $ticketResume.append(summaryContainer);
        }    
        _this.updateHalfDay()
      } else {
          $elementCible.remove();
      }

    }

    function updateTotal(nbTicket) {             
      constraintBottom()
      var $eltTotalNumber = $('#number-total');     
      $eltTotalNumber.text(nbTicket);
    }

    function createElement(type, classes, text, id) {
      var element = document.createElement(type);
      element.setAttribute('class', classes);
      if(text){
        element.textContent = text;
      }
      if(id){
        element.setAttribute('id', id+'-resume');
      }
      return element;
    }


  }

  updateHalfDay(){
    var _this = this
    var $ticketTarget = $('#isHalf')
    var $cardTarget = $('#isHalf-resume');
    var optionChecked = $('#booking_stepOne_isHalf option').filter(':selected').val()

    updateMoment (optionChecked)

    $.each(this.options.fields, function(index, field){
      if(field == 'isHalf') {
        let selector = $('#booking_stepOne_isHalf')
        
        selector.on('change', function(e) {
          e.preventDefault()
    
          optionChecked = $('#booking_stepOne_isHalf option').filter(':selected').val()
          updateMoment (optionChecked)

        })
      }

    })

    function updateMoment (optionChecked) {
      if (optionChecked == 0) {
        _this.options.moment = 'journée'
      } else {
        _this.options.moment = 'demi-journée'
      }
      $ticketTarget.text('À la ' + _this.options.moment )
      if($cardTarget.length > 0 && $cardTarget.text() != _this.options.moment) {
        $cardTarget.text(_this.options.moment)
      }
    }
  } 

  updateCalendar() {
    var _this = this
    var dateElts = document.querySelectorAll("[data-remaining]")
    dateElts.forEach(function(element) {
      var remaining = element.dataset.remaining
      if (remaining < _this.nbTicket) {
        element.setAttribute('disabled','disabled')
      } else if (remaining > 0 && !element.hasAttribute('data-disabled')) {
        element.removeAttribute('disabled')
      }
    });
  }

  setRemaining(remaining) {
    this.remainingTicket = remaining 
  }

  remainingToDate(date) {

    var _this = this
  
    var dateElts = document.querySelectorAll("[data-remaining]")

    dateElts.forEach(function(element) {
      var fulldate  = element.dataset.fulldate
      var remaining = element.dataset.remaining
      if (fulldate == date) {
        _this.setRemaining(remaining)
      }
    });
  }

  static updateRemaining() {
    var param =''
    var dateElts = document.querySelectorAll("[data-remaining]")
    dateElts.forEach(function(e,k) {
      if (k == 0 || k == (dateElts.length-1) ) {
        var fulldate = e.dataset.fulldate
        var day = fulldate.split('/')
        param += '/'
        param += day[0]
        if(k == (dateElts.length-1)){
          param += '/'
          param += day[1]   
          param += '/'
          param += day[2]   
        }
      }
    })

    $.ajax({
      type: 'POST',
      async:false,
      url: 'remaining'+param,
      success: function(data) {
        var allRemaining = data.remaining
        $.each(allRemaining,function(index,remaining){
          var fulldate = $(`[data-fulldate='${index}']`)
          fulldate.attr('data-remaining',remaining)
          if (remaining == 0) {
            fulldate.attr('disabled','disabled')
          }
        })
      }
    })
  }

  static create() {


    
    var $tickets = $('[data-ticket]')
    var fields = ['isHalf']
    
    for (let ticket of $tickets) {
      $(ticket).removeClass('is-hidden');
      if ($(ticket).data('name') != 'enfant') {
        $(ticket).removeClass('is-disabled')
      }
      var ticketLouvre = new Ticket( $(ticket), {
        price: $(ticket).data('price'),
        fields: fields,
        parent: true
      });
    }
    for (let field of fields) {
      var fieldElt = $( '#field-' + field )
      fieldElt.removeClass('is-hidden'); 
    }
    return ticketLouvre
  }



}

function constraintBottom() {
  // element lié a la taille de la card
  var element = $('[data-sticky]')
  var constraint = $('[data-container]')
  var constraintBottom = (constraint.offset().top + constraint.height()) - (element.children('div').height() + 24 )/*hauteur menu + back + steps + padding-haut et bas*/

  if ($(element).offset().top > constraintBottom ) {

    element.removeClass('booking-fixed')
    element.removeClass('booking-static')
    element.addClass('booking-absolute')

  } 
}


function setOriginalSelect ($select) {
    if ($select.data("originalHTML") == undefined) {
        $select.data("originalHTML", $select.html());
    } // If it's already there, don't re-set it
}

function removeOptions ($select, $options) {
    setOriginalSelect($select);
    $options.remove();
}

function restoreOptions ($select) {
    var ogHTML = $select.data("originalHTML");
    if (ogHTML != undefined) {
        $select.html(ogHTML);
    }
}