var hasParent = 0;
var hasChild = 0;
var nbTicketEnfant = 0;


class Ticket {

  constructor(selector, options) {

    if (!options) options = {};
    var defaultOptions = {
      nbMax: 6,
      price : 16,
      devise: '€',
      decimal: ',00',
      parent: false
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

    this.options = Object.assign({}, defaultOptions, options);
  
    this.build();
  }

  build() {
    var _this = this;
    var tmpNbTicket = 0;
    var nbTicket = 0;
    var isParent = _this.options.parent;
    
      
      this.btnMore.click(function (e) {

        e.preventDefault();
        
        if (isParent) { hasParent ++ };

        if (isParent && hasParent === 1 ) {
          var childTicket = $('#ticket-enfant');
          childTicket.removeClass('is-disabled');
          childTicket.find('.more').addClass('is-active');
          childTicket.find('#number-ticket').removeClass('has-text-white');
          childTicket.find('#number-ticket').text('0');
          hasChild ++;
          tmpNbTicket = 0
          nbTicketEnfant = 0
        }

        console.log(hasChild)
        console.log(hasChild)
        if ((isParent || hasChild > 0) && nbTicket < _this.options.nbMax ) {


          nbTicket ++;
          
          if (hasChild === 1 && !isParent) {
            tmpNbTicket = 0
            nbTicketEnfant ++;
            nbTicket = nbTicketEnfant;   
          } 

          if (nbTicket > 0 ) {
            _this.btnLess.removeClass('is-disabled');
            _this.btnLess.addClass('is-active');
            _this.eltNbTicket.parent().addClass('is-link-background');
            _this.eltNbTicket.addClass('has-text-white');
          }

          if (nbTicket > 5 ) {
            _this.btnMore.removeClass('is-active');
            _this.btnMore.addClass('is-disabled');
          }

          updateTicketSumary(_this.id, nbTicket);
          _this.eltNbTicket.text(nbTicket);
          
        }

      });

      this.btnLess.click(function (e) {

        e.preventDefault();

        if (isParent) { hasParent -- };
        
        if (isParent && hasParent === 0 ) {

          hasChild = 0;
          // nbTicketEnfant = 0;
          var childTicket = $('#ticket-enfant');
          var childNbTicket = childTicket.find('#number-ticket');

          childTicket.addClass('is-disabled');

          childTicket.find('.more').removeClass('is-active');
          childTicket.find('.less').removeClass('is-active');
          if (childNbTicket.text() > 0) {
            childTicket.find('.number-ticket').removeClass('is-link-background');
            childNbTicket.text('0');
            console.log(enfant.price * nbTicketEnfant)
            updateTicketSumary('ticket-enfant',0,{price:enfant.price * nbTicketEnfant});
          }
        }

        if ((isParent || hasChild > 0) && nbTicket > 0 ) {
            
          nbTicket --;

          if (hasChild === 1 && !isParent) {
            nbTicketEnfant --;
            nbTicket = nbTicketEnfant;   
          } 

          if (nbTicket == 0 ) {
            _this.btnLess.removeClass('is-active');
            _this.btnLess.addClass('is-disabled');
            _this.eltNbTicket.parent().removeClass('is-link-background');
            _this.eltNbTicket.removeClass('has-text-white');
          }
          if (nbTicket <= 5 ) {
            _this.btnMore.addClass('is-active');
            _this.btnMore.removeClass('is-disabled');
          }
          updateTicketSumary(_this.id, nbTicket);
          _this.eltNbTicket.text(nbTicket);

        }

      });

      function updateTicketSumary(id, nbTicket,options=false) {

        var $ticketResume = $('#ticket-resume');
        var $elementCible = $('#'+id+'-resume');
        var $elementFormCible = $('#ns_checkoutbundle_booking_'+id);

        var price = _this.options.price;
        var content = nbTicket + 'x ' + _this.eltTypeOfTicket.text();
        var total = _this.options.devise + (nbTicket * price) + _this.options.decimal;

        var summaryContainer = createElement('div','columns is-gapless is-marginless',null,id);
        var summaryContent = createElement('div','column is-two-thirds is-size-7', content);
        var summaryPrice = createElement('div','column is-size-7',total);

        summaryContainer.appendChild(summaryContent);
        summaryContainer.appendChild(summaryPrice);

        if (options && options.price) {
          price = options.price
        }

        $elementFormCible.val(nbTicket);

        updateTotal(price,nbTicket);

        if(nbTicket > 0) {
          if($elementCible.length > 0) {
            $elementCible.replaceWith(summaryContainer);
          } else {
            $ticketResume.append(summaryContainer);
          }    
        } else {
            $elementCible.remove();
        }

      }

      function updateTotal(price,nbTicket) {   
        
        constraintBottom()
      
        var $eltSubTotalPrice = $('#price-subtotal');
        var $eltTotalPrice = $('#price-total');
        var devise = _this.options.devise;
        var oldPrice = parseInt($eltSubTotalPrice.text().replace(devise,''));
        
        if (tmpNbTicket < nbTicket) {
          var newPrice = oldPrice + price;
          tmpNbTicket ++;
        } else {
          var newPrice = oldPrice - price;
          tmpNbTicket --;
        }

        $eltSubTotalPrice.text(devise+newPrice+_this.options.decimal);
        $eltTotalPrice.text(devise+newPrice+_this.options.decimal);

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