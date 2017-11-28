class BookingTicket {

  constructor(element, options) {

    if (!options) options = {}

    var defaultOptions = {
      devise: '€',
      decimal: ',00',
    };

    this.isHalf = document.querySelector('[data-ishalf]') ? true : false;

    this.element = element
    this.ticketId = this.element.dataset.ticket;
    this.ticketName = this.element.dataset.ticketname;
    this.ticketNameOfImage = this.element.dataset.ticketimage;
    this.ticketPrice = this.element.dataset.ticketprice;

    this.birthday_Day = this.element.querySelector('#booking_stepTwo_tickets_'+this.ticketId+'_birthday_day')
    this.birthday_Month = this.element.querySelector('#booking_stepTwo_tickets_'+this.ticketId+'_birthday_month')
    this.birthday_Year = this.element.querySelector('#booking_stepTwo_tickets_'+this.ticketId+'_birthday_year')

    this.imageElt = this.element.querySelector('#ticket-image')
    this.nameElt = this.element.querySelector('#ticket-name')
    this.priceReduce = 10;
    this.reduceElt = this.element.querySelector('#ticket-isReduce')
    this.isReduce = this.reduceElt.querySelector('input[type=checkbox]').checked;

    this.options = Object.assign({}, defaultOptions, options);

    this.build()
  }

  build(){

    var _this = this
    var _selectorChekbox = this.reduceElt.querySelector('input[type=checkbox]')

    this.birthday_Day.addEventListener('change', function (e) {
      e.preventDefault();
      _this.updateTicket()
    }) 
    this.birthday_Month.addEventListener('change', function (e) {
      e.preventDefault();
      _this.updateTicket()
    }) 
    this.birthday_Year.addEventListener('change', function (e) {
      e.preventDefault();
      _this.updateTicket()
    }) 
    _selectorChekbox.addEventListener('change', function (e) {
      e.preventDefault();
       if (_selectorChekbox.checked) {
            _this.isReduce = true;
            _this.updateTicket('nocheck')
        } else {
            _this.isReduce = false;
            _this.updateTicket('check')
            // do something else otherwise
        }
    }) 

    _this.updateTicket()

  }

  updateTicket(checkboxChange = false) {
    // Variables de date
    var now = new Date();
    var birthday = new Date(this.birthday_Year.value,this.birthday_Month.value-1,this.birthday_Day.value); 
    var age = this.calculateAge(birthday)

    if (!this.birthday_Year.value) {
      return  
    }

    // Variables d'image
    var path = this.imageElt.src

    var ticketResume = document.getElementById('ticket-resume');

    if (age < 12){    

        if (checkboxChange == 'check') {
          var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
        } else if(checkboxChange == 'nocheck') {
          var oldElement = '#ticket-' + this.ticketName + '-resume';
        } else {
          if (this.isReduce) {
            var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
          } else {
            var oldElement = '#ticket-' + this.ticketName + '-resume';
          }
        }

        // Remplacement du nom
        var newName = 'enfant'
        var newPrice = 8
        var _selectorChekbox = this.reduceElt.querySelector('input[type=checkbox]')
        _selectorChekbox.checked = false
        this.isReduce = false
        if (this.isHalf) { newPrice /= 2}

        this.nameElt.textContent = newName
        var newPath = path.replace(this.ticketNameOfImage,'la-vierge-et-l-enfant.jpg')
        this.ticketNameOfImage = 'la-vierge-et-l-enfant.jpg'
        
        // Remplacement de l'image
        this.imageElt.src = newPath

        // Masquage du bouton isReduce
        this.reduceElt.classList.add("is-hidden") 

        this.updateTicketSumary(newName,newPrice,oldElement,checkboxChange)

    } else if(age >= 12 && age < 60){

        if (checkboxChange == 'check') {
          var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
        } else if(checkboxChange == 'nocheck') {
          var oldElement = '#ticket-' + this.ticketName + '-resume';
        } else {
          if (this.isReduce) {
            var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
          } else {
            var oldElement = '#ticket-' + this.ticketName + '-resume';
          }
        }


        var newName = 'normal'
        if (this.isReduce) {
          var newPrice = 10
        } else {
          var newPrice = 16
        }
        if (this.isHalf) { newPrice /= 2}

        // Remplacement du nom
        this.nameElt.textContent = newName
        
        // Remplacement de l'image
        var newPath = path.replace(this.ticketNameOfImage,'delacroix.jpg')
        this.ticketNameOfImage = 'delacroix.jpg'
        this.imageElt.src = newPath
        
        // Affichage du bouton isReduce
        this.reduceElt.classList.remove("is-hidden")

        this.updateTicketSumary(newName,newPrice,oldElement,checkboxChange)

    } else if(age >= 60){

        if (checkboxChange == 'check') {
          var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
        } else if(checkboxChange == 'nocheck') {
          var oldElement = '#ticket-' + this.ticketName + '-resume';
        } else {
          if (this.isReduce) {
            var oldElement = '#ticket-' + this.ticketName + '-resume-reduce';
          } else {
            var oldElement = '#ticket-' + this.ticketName + '-resume';
          }
        }
      
        var newName = 'senior'  
        if (this.isReduce) {
          var newPrice = 10
        } else {
          var newPrice = 12
        }   
        if (this.isHalf) { newPrice /= 2}
        

        // Remplacement du nom
        this.nameElt.textContent = newName

        // Remplacement de l'image
        var newPath = path.replace(this.ticketNameOfImage,'laitiere.jpg')
        this.ticketNameOfImage = 'laitiere.jpg'
        this.imageElt.src = newPath
        
        // Affichage du bouton isReduce
        this.reduceElt.classList.remove("is-hidden")
        this.updateTicketSumary(newName,newPrice,oldElement,checkboxChange)

    }
  
  }

  calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  updateTicketSumary(valueCibleName,valueCiblePrice,oldElement,checkboxChange) {

    var ticketResume = document.getElementById('ticket-resume');
    var elementSource = ticketResume.querySelector(oldElement);
    var eltSourceName = elementSource.querySelector('#resume-nbr')
    var eltSourcePrice = elementSource.querySelector('#price-subsubtotal')

    var valueSourceNbTicket= elementSource.dataset.nombre
    var valueSourceName = elementSource.dataset.name
    var valueSourcePrice = elementSource.dataset.price

    if (this.isReduce) {
      var elementCible = ticketResume.querySelectorAll('#ticket-'+ valueCibleName +'-resume-reduce');
    } else {   
      var elementCible = ticketResume.querySelectorAll('#ticket-'+ valueCibleName +'-resume');
    }


    if ( (valueSourceName != valueCibleName)
       ||(valueSourceName == valueCibleName && checkboxChange)
    ) {

      var valueNewSourceNbTicket = parseFloat(valueSourceNbTicket) - 1

      if (valueNewSourceNbTicket == 0) {
        elementSource.remove() 
      } else {

        elementSource.dataset.nombre = valueNewSourceNbTicket
        eltSourceName.textContent = valueNewSourceNbTicket + 'x ' + valueSourceName[0].toUpperCase() + valueSourceName.substring(1)
        if (!this.isReduce) {
          eltSourceName.textContent += ' (tarif réduit)'  
        }
        eltSourcePrice.textContent = this.options.devise + (valueNewSourceNbTicket * valueSourcePrice) + this.options.decimal
      
      }
      
      if (elementCible.length > 0 ) {

        elementCible = elementCible[0]
        var eltCibleName = elementCible.querySelector('#resume-nbr')
        var eltCiblePrice = elementCible.querySelector('#price-subsubtotal')
        var valueCibleNbTicket= elementCible.dataset.nombre
        var valueCibleName = elementCible.dataset.name
        var valueCiblePrice = elementCible.dataset.price

        var valueNewCibleNbTicket = parseFloat(valueCibleNbTicket) + 1 

        elementCible.dataset.nombre = valueNewCibleNbTicket
        eltCibleName.textContent = valueNewCibleNbTicket + 'x ' + valueCibleName[0].toUpperCase() + valueCibleName.substring(1)
        if (this.isReduce) {
          eltCibleName.textContent += ' (tarif réduit)'  
        }
        eltCiblePrice.textContent = this.options.devise + (valueNewCibleNbTicket * valueCiblePrice) + this.options.decimal
      
      } else {

        var eltCiblePrice = this.options.devise + valueCiblePrice + this.options.decimal;
        var eltCibleName = '1x ' + valueCibleName[0].toUpperCase() + valueCibleName.substring(1);
        var id = 'ticket-' + valueCibleName + '-resume'

        if(this.isReduce) {
          eltCibleName += ' (tarif réduit)'
          id += '-reduce'
        } 

        var summaryContainer = this.createElement('div','columns is-gapless is-marginless',null,id,valueCibleName,valueCiblePrice,1);
        var summaryContent = this.createElement('div','column is-two-thirds is-size-7', eltCibleName, 'resume-nbr');
        var summaryPrice = this.createElement('div','column is-size-7',eltCiblePrice,'price-subsubtotal');
        
        summaryContainer.appendChild(summaryContent);
        summaryContainer.appendChild(summaryPrice);

        ticketResume.appendChild(summaryContainer);
        
      }

      this.ticketName = valueCibleName
      this.updateTotal(ticketResume)
    }

  }

  updateTotal(ticketResume) {  

    var allRow = ticketResume.querySelectorAll('[data-name]')
    var total = 0

    allRow.forEach(function(row) {
      var price = row.dataset.price
      var number = row.dataset.nombre
      total += price * number
    })
    
    // constraintBottom()
  
    var eltSubTotalPrice = document.querySelector('#price-subtotal');
    var eltTotalPrice = document.querySelector('#price-total');
    var devise = this.options.devise; 
    
    eltSubTotalPrice.textContent = devise + total + this.options.decimal
    eltTotalPrice.textContent    = devise + total + this.options.decimal
  }

  createElement(type, classes, text, id, name, price, number) {
    var element = document.createElement(type);
    element.setAttribute('class', classes);
    if(text){
      element.textContent = text;
    }
    if(id){
      element.setAttribute('id', id);
    }
    if(name){
      element.setAttribute('data-name', name);
    }
    if (price) {
      element.setAttribute('data-price', price);
    } 
    if (number) {
      element.setAttribute('data-nombre', number);
    } 
    return element;
  }








  static create(selector) {
    var ticket = document.querySelectorAll(selector).forEach(element => new BookingTicket(element,{}))
  }

}