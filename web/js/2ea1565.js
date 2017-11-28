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
        var $selector = $('#booking_stepOne_isHalf')
        var $spacesVal = $('#number-ticket').text()
        var $remainingElt = $("[data-fulldate='"+e.getDate()+ '/' + (e.getMonth()+1) + '/' + e.getFullYear() +"']")
        var $remainingVal = $remainingElt.attr('data-remaining')
        var btnMore = $('#ticket-billet .more')

        if ($remainingVal == $spacesVal ) {
          btnMore.removeClass('is-active');
          btnMore.addClass('is-disabled');
        } else {
          btnMore.addClass('is-active');
          btnMore.removeClass('is-disabled');       
        }
        
        if (now.getHours() >= 14
            && today == daySelect   
        ) {
          var $optionsToRemove = $selector.find('option[value="0"]');
          removeOptions($selector, $optionsToRemove);   
        } else {
          restoreOptions($selector);
        }
      }

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
document.addEventListener( 'DOMContentLoaded', function () {
  if ($("[data-booking]")) {
    var booking = new Booking()
  }  
});
class Booking {
    constructor(selector, options) 
    {
      this.date;
      this.isHalf;
      this.spaces
      this.tickets = BookingTicket.create('[data-ticket]');
    }

}
var now = null;
var datepicker_langs = {
  en: {
    weekStart: 1,
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  fr: {
    weekStart: 1,
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Auo', 'Sep', 'Oct', 'Nov', 'Déc'],
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  },
  de: {
    weekStart: 1,
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Febr', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  }
}

class MyDatePicker {
  constructor(selector, options) {
    if (!options) options = {}

    var defaultOptions = {
      startDate: new Date(),
      // the default position 
      popUp: false,
      overlay: false,
      // close after click
      closeAfterClick: false,
      overlay: false,
      // the default data format `field` value
      dataFormat: 'yyyy/mm/dd',
      // internationalization
      lang: 'en',
      closeOnSelect: false,
      // callback function
      onSelect: null,
      onOpen: null,
      onClose: null,
      onRender: null
    };

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this.parent = this.element.parentElement;
    this.lang = typeof datepicker_langs[this.lang] !== 'undefined' ? this.lang : 'en';

    this.options = Object.assign({}, defaultOptions, options);

    this.hasTicket = 0;
    this.ticketLouvre = null;

    this.month = this.options.startDate.getMonth(),
      this.year = this.options.startDate.getFullYear(),
      this.open = false;

    this.build();
  }

  build() {
    var _this = this;
    var container = document.getElementById('datepicker');

    this.datePickerContainer = document.createElement('div');
    this.datePickerContainer.id = 'datePicker' + ( new Date ).getTime();
    this.datePickerContainer.classList.add('datepicker');
    this.datePickerContainer.classList.add('is-active');

    this.calendarContainer = document.createElement('div');
    this.calendarContainer.id = 'datePicker' + ( new Date ).getTime();
    this.calendarContainer.classList.add('calendar');
    this.renderCalendar();

    if (this.options.overlay) {
      var datePickerOverlay = document.createElement('div');
      datePickerOverlay.classList.add('is-overlay');
      this.datePickerContainer.appendChild(datePickerOverlay);
    }

    this.datePickerContainer.appendChild(this.calendarContainer);
    container.appendChild(this.datePickerContainer);

    this.element.addEventListener('click', function (e) {
      e.preventDefault();
      if (_this.open && _this.options.closeAfterClick === true ) {
        _this.hide();
        _this.open = false;
      } else {
        _this.show();
        _this.open = true;
      }
    });
  }

  /**
  * templating functions to abstract HTML rendering
  */
  renderDayName(day, abbr = false) {
    day += datepicker_langs[this.options.lang].weekStart;
    while (day >= 7) {
      day -= 7;
    }

    return abbr ? datepicker_langs[this.options.lang].weekdaysShort[day] : datepicker_langs[this.options.lang].weekdays[day];
  }

  renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut,isRemaining) {
    var _this = this;
    var newDayContainer = document.createElement('div');
    var newDay = document.createElement('div');
    var newDayButton = document.createElement('button');

    newDayButton.classList.add('date-item');
    newDayButton.innerHTML = day;
    newDayButton.addEventListener('click', function (e) {
      if (typeof _this.options.onSelect != 'undefined' &&
        _this.options.onSelect != null &&
        _this.options.onSelect) {
        _this.options.onSelect(new Date(year, month, day));
      }
      _this.element.value = _this.getFormatedDate(( new Date(year, month, day) ), _this.options.dataFormat);
     
      var allDayContainer = $(".calendar-date.is-active");
      
      var ticketDateElement = $("#ticketDate");
      var ticketDateFormElement = $("#booking_stepOne_date");
      var ticketDateToElement = _this.getFormatedDate(( new Date(year, month, day) ), 'd M. yyyy');
      var ticketDateToFormElement = _this.getFormatedDate(( new Date(year, month, day) ), 'dd/mm/yyyy');


      ticketDateElement.text(ticketDateToElement);
      ticketDateFormElement.val(ticketDateToFormElement);
      allDayContainer.removeClass('is-active');
      newDayContainer.classList.add('is-active');

      if (!_this.ticketLouvre ) {
        
        var ticketLouvre = Ticket.create();
        _this.hasTicket = 1;
        _this.ticketLouvre = ticketLouvre;
      }
      _this.ticketLouvre.remainingToDate(ticketDateToFormElement)
     
      if (_this.options.closeOnSelect) {
        _this.hide();
      }

    });

    newDay.appendChild(newDayButton);

    newDayContainer.dataset.fulldate = day + '/' + (month+1) + '/' + year;
    newDayContainer.classList.add('calendar-date');
    newDayContainer.appendChild(newDay);


    newDay.classList.add('calendar-date');
    if (isRemaining) {
      newDayContainer.dataset.remaining ='';
    }
    if (isDisabled) {
      newDayContainer.dataset.disabled = "";
      newDayContainer.setAttribute('disabled', 'disabled');
    }
    if (isToday) {
      newDayContainer.classList.add('is-today');
    }
    if (isSelected) {
      newDayContainer.classList.add('is-active');
    }
    if (isBetween) {
      newDayContainer.classList.add('calendar-range');
    }
    if (isSelectedIn) {
      newDayContainer.classList.add('range-start');
    }
    if (isSelectedOut) {
      newDayContainer.classList.add('range-end');
    }

    return newDayContainer;
  }

  renderNav(year, month) {
    var _this = this;
    var calendarNav = document.createElement('div');
    calendarNav.classList.add('calendar-nav');

    var previousButtonContainer = document.createElement('div');
    previousButtonContainer.classList.add('calendar-nav-left');
    previousButtonContainer.dataset.navcalendar = '';
    this.previousYearButton = document.createElement('div');
    this.previousYearButton.classList.add('button');
    this.previousYearButton.classList.add('is-text');
    var previousButtonIcon = document.createElement('i');
    previousButtonIcon.classList.add('fa');
    previousButtonIcon.classList.add('fa-backward');
    this.previousYearButton.appendChild(previousButtonIcon);
    this.previousYearButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.prevYear();
    });
    if(year > now.getFullYear()) {
      previousButtonContainer.appendChild(this.previousYearButton);
    }

    this.previousMonthButton = document.createElement('div');
    this.previousMonthButton.classList.add('button');
    this.previousMonthButton.classList.add('is-text');
    var previousMonthButtonIcon = document.createElement('i');
    previousMonthButtonIcon.classList.add('fa');
    previousMonthButtonIcon.classList.add('fa-chevron-left');
    this.previousMonthButton.appendChild(previousMonthButtonIcon);
    this.previousMonthButton.addEventListener('click', function (e) {
      e.preventDefault();
      
      _this.prevMonth();
    });
    if(month > now.getMonth() || year > now.getFullYear()) {
      previousButtonContainer.appendChild(this.previousMonthButton);
    }


    var calendarTitle = document.createElement('div');
    calendarTitle.innerHTML = datepicker_langs[this.options.lang].months[month] + ' ' + year;

    var nextButtonContainer = document.createElement('div');
    nextButtonContainer.classList.add('calendar-nav-right');
    nextButtonContainer.dataset.navcalendar = '';    
    this.nextMonthButton = document.createElement('div');
    this.nextMonthButton.classList.add('button');
    this.nextMonthButton.classList.add('is-text');
    var nextMonthButtonIcon = document.createElement('i');
    nextMonthButtonIcon.classList.add('fa');
    nextMonthButtonIcon.classList.add('fa-chevron-right');
    this.nextMonthButton.appendChild(nextMonthButtonIcon);
    this.nextMonthButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.nextMonth();
    });
    nextButtonContainer.appendChild(this.nextMonthButton);
    this.nextYearButton = document.createElement('div');
    this.nextYearButton.classList.add('button');
    this.nextYearButton.classList.add('is-text');
    var nextYearButtonIcon = document.createElement('i');
    nextYearButtonIcon.classList.add('fa');
    nextYearButtonIcon.classList.add('fa-forward');
    this.nextYearButton.appendChild(nextYearButtonIcon);
    this.nextYearButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.nextYear();
    });
    nextButtonContainer.appendChild(this.nextYearButton);

    calendarNav.appendChild(previousButtonContainer);
    calendarNav.appendChild(calendarTitle);
    calendarNav.appendChild(nextButtonContainer);

    return calendarNav;
  }

  renderHeader() {
    var calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');

    for (var i = 0; i < 7; i++) {
      var newDay = document.createElement('div');
      newDay.classList.add('calendar-date');
      newDay.innerHTML = this.renderDayName(i, true);
      calendarHeader.appendChild(newDay);
    }

    return calendarHeader;
  }

  renderBody() {
    var calendarBody = document.createElement('div');
    calendarBody.classList.add('calendar-body');

    return calendarBody;
  }

  renderCalendar() {

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth(); //Months are zero based
    var curr_year = d.getFullYear();
    now = new Date(curr_year,curr_month,curr_date);


    var ticketDateElement = $("#ticketDate");
    if (document.getElementById( 'booking_stepOne_date' )) {
      var ticketDateFormElement = document.getElementById( 'booking_stepOne_date' ).value;
      if (ticketDateFormElement) {
        this.hasTicket = 1;
        var date = ticketDateFormElement.split('/');
        var ticketDateToElement = this.getFormatedDate(( new Date(date[2],date[1]-1,date[0]) ), 'd M. yyyy');
        ticketDateElement.text(ticketDateToElement);
      }
    }
    
    var ticketDateValue = new Date($("#ticketDate").text());

    var calendarNav = this.renderNav(this.year, this.month);
    var calendarHeader = this.renderHeader();
    var calendarBody = this.renderBody();

    this.calendarContainer.appendChild(calendarNav);
    this.calendarContainer.appendChild(calendarHeader);
    this.calendarContainer.appendChild(calendarBody);

    var days = this.getDaysInMonth(this.year, this.month),
      before = new Date(this.year, this.month, 1).getDay();

    if (typeof this.options.onRender != 'undefined' &&
      this.options.onRender != null &&
      this.options.onRender) {
      this.options.onRender(this);
    }

    if (datepicker_langs[this.options.lang].weekStart > 0) {
      before -= datepicker_langs[this.options.lang].weekStart;
      if (before < 0) {
        before += 7;
      }
    }

    var cells = days + before,
      after = cells;
    while (after > 7) {
      after -= 7;
    }
    cells += 7 - after;
    for (var i = 0; i < cells; i++) {
      var day = new Date(this.year, this.month  , 1 + ( i - before )),
        isBetween = false,
        isSelected = this.compareDates(day, ticketDateValue),
        isSelectedIn = false,
        isSelectedOut = false,
        isToday = this.compareDates(day, now),
        isEmpty = i < before || i >= ( days + before ),
        isDisabled = false,
        isRemaining = false;

      if (!isSelected) {
        isSelectedIn = false;
        isSelectedOut = false;
      }

      var remaining = null;

      if (day.getMonth() !== this.month 
        || day < now                                      // TOUS LES JOURS AVANT AUJOURD'HUI
        || day.getDay() == 2                              // TOUS LES MARDI                 
        || (day.getDate() == 1 && day.getMonth() == 4)    // 1 MAI                        
        || (day.getDate() == 1 && day.getMonth() == 10)   // 1 NOVEMBRE
        || (day.getDate() == 25 && day.getMonth() == 11)  // 25 DECEMBRE
      ) {
        isDisabled = true;
      } else {
        isRemaining = true;
      }
      calendarBody.append(this.renderDay(day.getDate(), this.month, this.year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut,isRemaining));
    }
  }

  prevMonth() {
    this.month -= 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  nextMonth() {
    this.month += 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  prevYear() {
    this.year -= 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  nextYear() {
    this.year += 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  show() {
    if (typeof this.options.onOpen != 'undefined' &&
      this.options.onOpen != null &&
      this.options.onOpen) {
      this.options.onOpen(this);
    }
    this.datePickerContainer.classList.add('is-active');
    if(this.options.popUp == true) {
      this.adjustPosition();
    }
    this.open = true;
  }

  hide() {
    this.open = false;
    if (typeof this.options.onClose != 'undefined' &&
      this.options.onClose != null &&
      this.options.onClose) {
      this.options.onClose(this);
    }
    this.datePickerContainer.classList.remove('is-active');
  }

  adjustCalendar() {
    if (this.month < 0) {
      this.year -= Math.ceil(Math.abs(this.month) / 12);
      this.month += 12;
    }
    if (this.month > 11) {
      this.year += Math.floor(Math.abs(this.month) / 12);
      this.month -= 12;
    }
    this.calendarContainer.innerHTML = '';
    return this;
  }

  adjustPosition() {
    var width = this.calendarContainer.offsetWidth,
      height = this.calendarContainer.offsetHeight,
      viewportWidth = window.innerWidth || document.documentElement.clientWidth,
      viewportHeight = window.innerHeight || document.documentElement.clientHeight,
      scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
      left, top, clientRect;

    if (typeof this.element.getBoundingClientRect === 'function') {
      clientRect = this.element.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else {
      left = this.element.offsetLeft;
      top = this.element.offsetTop + this.element.offsetHeight;
      while (( this.element = this.element.offsetParent )) {
        left += this.element.offsetLeft;
        top += this.element.offsetTop;
      }
    }

    this.calendarContainer.style.position = 'absolute';
    this.calendarContainer.style.left = left + 'px';
    this.calendarContainer.style.top = top + 'px';
    
    this.calendarContainer.style.top = top + 'px';
  }

  destroy() {
    this.calendarContainer.remove();
  }

  /**
  * Returns date according to passed format
  *
  * @param {Date}   dt     Date object
  * @param {String} format Format string
  *      d    - day of month
  *      dd   - 2-digits day of month
  *      D    - day of week
  *      m    - month number
  *      mm   - 2-digits month number
  *      M    - short month name
  *      MM   - full month name
  *      yy   - 2-digits year number
  *      yyyy - 4-digits year number
  */
  getFormatedDate(dt, format) {
    var items = {
      d: dt.getDate(),
      dd: dt.getDate(),
      D: dt.getDay(),
      m: dt.getMonth() + 1,
      mm: dt.getMonth() + 1,
      M: dt.getMonth(),
      MM: dt.getMonth(),
      yy: dt.getFullYear().toString().substr(-2),
      yyyy: dt.getFullYear()
    };

    items.dd < 10 && ( items.dd = '0' + items.dd );
    items.mm < 10 && ( items.mm = '0' + items.mm );
    items.D = datepicker_langs[this.options.lang].weekdays[items.D ? items.D - 1 : 6];
    items.M = datepicker_langs[this.options.lang].monthsShort[items.M];
    items.MM = datepicker_langs[this.options.lang].months[items.MM];

    return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function (m) {
      return typeof items[m] !== 'undefined' ? items[m] : m;
    });
  }

  /**
  * Returns true if date picker is visible now
  *
  * @returns {Boolean}
  */


  isDate(obj) {
    return ( /Date/ ).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  }

  isLeapYear(year) {
    // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  getDaysInMonth(year, month) {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  compareDates(a, b) {
    // weak date comparison (use setToStartOfDay(date) to ensure correct result)
    return a.getTime() === b.getTime();
  }
}
(function($) {
  $(window).load(function(){
    /*Variables*/
    var container = $('[data-wrapper]')
    var element = $('[data-sticky]')
    var constraint = $('[data-container]')
    var elementTop = element.position().top -12 + 72 + 40 + 80 /* = moins padding-top de datawrapper + menu + back+ steps */  
    var constraintBottom = (constraint.offset().top + constraint.height()) - (element.children('div').height() )/*hauteur menu + back + steps + padding-haut et bas*/
    
    /*Console.log test*/
    // console.log("constraintHeight : " + constraint.height())
    // console.log("elementHeight : " + element.height())
    // console.log("elementTop : " + elementTop)
    // console.log("constraintBottom : " + constraintBottom)
    // console.log("constraintTop : " + constraint.offset().top + " + constraintHeight : " + constraint.height() + " - elementHeight : " + element.children('div').height() )

    /*Fonctions scroll*/
    $(window).scroll(function(e){
      constraintBottom = (constraint.offset().top + constraint.height()) - (element.children('div').height() )/*hauteur menu + back + steps + padding-haut et bas*/      
      var scrollTop = $(this).scrollTop()
      // console.log("scrollTop : " + scrollTop)
      // console.log("Top : " + elementTop)
      // console.log("Bottom : " + constraintBottom)

      var hasScrollClass = element.hasClass("booking-fixed")

      element.css('width', container.width())

      if (scrollTop > constraintBottom ) {

        element.removeClass('booking-fixed')
        element.removeClass('booking-static')
        element.addClass('booking-absolute')

      } else if (scrollTop > elementTop && !hasScrollClass) {

        element.removeClass('booking-absolute')
        element.removeClass('booking-static')
        element.addClass('booking-fixed')

      } else if (scrollTop < elementTop && hasScrollClass) {

        element.removeClass('booking-absolute')
        element.removeClass('booking-fixed')
        element.addClass('booking-static')

      }
    });
    /*Fonctions rezise*/
    $(window).resize(function(e){
      element.removeClass('booking-fixed')
      element.removeClass('booking-absolute')
      element.removeClass('booking-static')
      container = $('[data-wrapper]')
      constraintBottom = (constraint.offset().top + constraint.height()) - (element.children('div').height() + 24)/*hauteur menu + padding-haut et bas*/
      elementTop = element.position().top - 53 /*53 = hauteur menu*/

    })
    
  })

})(jQuery)
var datepicker_langs = {
  en: {
    weekStart: 1,
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  fr: {
    weekStart: 1,
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Auo', 'Sep', 'Oct', 'Nov', 'Déc'],
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  },
  de: {
    weekStart: 1,
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Febr', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  }
}

class DatePicker {
  constructor(selector, options) {
    if (!options) options = {}

    var defaultOptions = {
      startDate: new Date(),
      // the default data format `field` value
      dataFormat: 'yyyy/mm/dd',
      // internationalization
      lang: 'en',
      overlay: false,
      closeOnSelect: true,
      // callback function
      onSelect: null,
      onOpen: null,
      onClose: null,
      onRender: null
    };

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this.parent = this.element.parentElement;
    this.lang = typeof datepicker_langs[this.lang] !== 'undefined' ? this.lang : 'en';

    this.options = Object.assign({}, defaultOptions, options);


    this.month = this.options.startDate.getMonth(),
    this.year = this.options.startDate.getFullYear(),
    this.open = false;

    this.build();
  }

  build() {
    var _this = this;

    this.datePickerContainer = document.createElement('div');
    this.datePickerContainer.id = 'datePicker' + ( new Date ).getTime();
    if (this.options.overlay) {
      this.datePickerContainer.classList.add('modal');
    }
    this.datePickerContainer.classList.add('datepicker');

    this.calendarContainer = document.createElement('div');
    this.calendarContainer.id = 'datePicker' + ( new Date ).getTime();
    this.calendarContainer.classList.add('calendar');
    this.renderCalendar();

    if (this.options.overlay) {
      var datePickerOverlay = document.createElement('div');
      datePickerOverlay.classList.add('modal-background');
      this.datePickerContainer.appendChild(datePickerOverlay);
    }

    var modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.addEventListener('click', function(e) {
      e.preventDefault();

      _this.datePickerContainer.classList.remove('is-active');
    })

    this.datePickerContainer.appendChild(this.calendarContainer);
    this.datePickerContainer.appendChild(modalClose);
    document.body.appendChild(this.datePickerContainer);

    this.element.addEventListener('click', function (e) {
      e.preventDefault();

      if (_this.open) {
        _this.hide();
        _this.open = false;
      } else {
        _this.show();
        _this.open = true;
      }
    });
  }

  /**
   * templating functions to abstract HTML rendering
   */
  renderDayName(day, abbr = false) {
    day += datepicker_langs[this.options.lang].weekStart;
    while (day >= 7) {
      day -= 7;
    }

    return abbr ? datepicker_langs[this.options.lang].weekdaysShort[day] : datepicker_langs[this.options.lang].weekdays[day];
  }

  renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut) {
    var _this = this;
    var newDayContainer = document.createElement('div');
    var newDayButton = document.createElement('button');

    newDayButton.classList.add('date-item');
    newDayButton.innerHTML = day;
    newDayButton.addEventListener('click', function (e) {
      if (typeof _this.options.onSelect != 'undefined' &&
        _this.options.onSelect != null &&
        _this.options.onSelect) {
        _this.options.onSelect(new Date(year, month, day));
      }
      _this.element.value = _this.getFormatedDate(( new Date(year, month, day) ), _this.options.dataFormat);
      if (_this.options.closeOnSelect) {
        _this.hide();
      }
    });

    newDayContainer.classList.add('calendar-date');
    newDayContainer.appendChild(newDayButton);

    if (isDisabled) {
      newDayContainer.setAttribute('disabled', 'disabled');
    }
    if (isToday) {
      newDayContainer.classList.add('is-today');
    }
    if (isSelected) {
      newDayContainer.classList.add('is-active');
    }
    if (isBetween) {
      newDayContainer.classList.add('calendar-range');
    }
    if (isSelectedIn) {
      newDayContainer.classList.add('range-start');
    }
    if (isSelectedOut) {
      newDayContainer.classList.add('range-end');
    }

    return newDayContainer;
  }

  renderNav(year, month) {
    var _this = this;
    var calendarNav = document.createElement('div');
    calendarNav.classList.add('calendar-nav');

    var previousButtonContainer = document.createElement('div');
    previousButtonContainer.classList.add('calendar-nav-left');
    this.previousYearButton = document.createElement('div');
    this.previousYearButton.classList.add('button');
    this.previousYearButton.classList.add('is-text');
    var previousButtonIcon = document.createElement('i');
    previousButtonIcon.classList.add('fa');
    previousButtonIcon.classList.add('fa-backward');
    this.previousYearButton.appendChild(previousButtonIcon);
    this.previousYearButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.prevYear();
    });
    previousButtonContainer.appendChild(this.previousYearButton);

    this.previousMonthButton = document.createElement('div');
    this.previousMonthButton.classList.add('button');
    this.previousMonthButton.classList.add('is-text');
    var previousMonthButtonIcon = document.createElement('i');
    previousMonthButtonIcon.classList.add('fa');
    previousMonthButtonIcon.classList.add('fa-chevron-left');
    this.previousMonthButton.appendChild(previousMonthButtonIcon);
    this.previousMonthButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.prevMonth();
    });
    previousButtonContainer.appendChild(this.previousMonthButton);


    var calendarTitle = document.createElement('div');
    calendarTitle.innerHTML = datepicker_langs[this.options.lang].months[month] + ' ' + year;

    var nextButtonContainer = document.createElement('div');
    nextButtonContainer.classList.add('calendar-nav-right');
    this.nextMonthButton = document.createElement('div');
    this.nextMonthButton.classList.add('button');
    this.nextMonthButton.classList.add('is-text');
    var nextMonthButtonIcon = document.createElement('i');
    nextMonthButtonIcon.classList.add('fa');
    nextMonthButtonIcon.classList.add('fa-chevron-right');
    this.nextMonthButton.appendChild(nextMonthButtonIcon);
    this.nextMonthButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.nextMonth();
    });
    nextButtonContainer.appendChild(this.nextMonthButton);
    this.nextYearButton = document.createElement('div');
    this.nextYearButton.classList.add('button');
    this.nextYearButton.classList.add('is-text');
    var nextYearButtonIcon = document.createElement('i');
    nextYearButtonIcon.classList.add('fa');
    nextYearButtonIcon.classList.add('fa-forward');
    this.nextYearButton.appendChild(nextYearButtonIcon);
    this.nextYearButton.addEventListener('click', function (e) {
      e.preventDefault();

      _this.nextYear();
    });
    nextButtonContainer.appendChild(this.nextYearButton);

    calendarNav.appendChild(previousButtonContainer);
    calendarNav.appendChild(calendarTitle);
    calendarNav.appendChild(nextButtonContainer);

    return calendarNav;
  }

  renderHeader() {
    var calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');

    for (var i = 0; i < 7; i++) {
      var newDay = document.createElement('div');
      newDay.classList.add('calendar-date');
      newDay.innerHTML = this.renderDayName(i, true);
      calendarHeader.appendChild(newDay);
    }

    return calendarHeader;
  }

  renderBody() {
    var calendarBody = document.createElement('div');
    calendarBody.classList.add('calendar-body');

    return calendarBody;
  }

  renderCalendar() {
    var now = new Date();

    var calendarNav = this.renderNav(this.year, this.month);
    var calendarHeader = this.renderHeader();
    var calendarBody = this.renderBody();

    this.calendarContainer.appendChild(calendarNav);
    this.calendarContainer.appendChild(calendarHeader);
    this.calendarContainer.appendChild(calendarBody);

    var days = this.getDaysInMonth(this.year, this.month),
      before = new Date(this.year, this.month, 1).getDay();

    if (typeof this.options.onRender != 'undefined' &&
      this.options.onRender != null &&
      this.options.onRender) {
      this.options.onRender(this);
    }

    if (datepicker_langs[this.options.lang].weekStart > 0) {
      before -= datepicker_langs[this.options.lang].weekStart;
      if (before < 0) {
        before += 7;
      }
    }

    var cells = days + before,
      after = cells;
    while (after > 7) {
      after -= 7;
    }

    cells += 7 - after;
    for (var i = 0; i < cells; i++) {
      var day = new Date(this.year, this.month, 1 + ( i - before )),
        isBetween = false,
        isSelected = false,
        isSelectedIn = false,
        isSelectedOut = false,
        isToday = this.compareDates(day, now),
        isEmpty = i < before || i >= ( days + before ),
        isDisabled = false;

      if (!isSelected) {
        isSelectedIn = false;
        isSelectedOut = false;
      }

      if (day.getMonth() !== this.month) {
        isDisabled = true;
      }

      calendarBody.append(this.renderDay(day.getDate(), this.month, this.year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut));
    }
  }

  prevMonth() {
    this.month -= 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  nextMonth() {
    this.month += 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  prevYear() {
    this.year -= 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  nextYear() {
    this.year += 1;
    this.adjustCalendar();
    this.renderCalendar();
  }

  show() {
    if (typeof this.options.onOpen != 'undefined' &&
      this.options.onOpen != null &&
      this.options.onOpen) {
      this.options.onOpen(this);
    }
    this.datePickerContainer.classList.add('is-active');
    if (!this.options.overlay) {
      this.adjustPosition();
    }
    this.open = true;
  }

  hide() {
    this.open = false;
    if (typeof this.options.onClose != 'undefined' &&
      this.options.onClose != null &&
      this.options.onClose) {
      this.options.onClose(this);
    }
    this.datePickerContainer.classList.remove('is-active');
  }

  adjustCalendar() {
    if (this.month < 0) {
      this.year -= Math.ceil(Math.abs(this.month) / 12);
      this.month += 12;
    }
    if (this.month > 11) {
      this.year += Math.floor(Math.abs(this.month) / 12);
      this.month -= 12;
    }
    this.calendarContainer.innerHTML = '';
    return this;
  }

  adjustPosition() {
    var width = this.calendarContainer.offsetWidth,
      height = this.calendarContainer.offsetHeight,
      viewportWidth = window.innerWidth || document.documentElement.clientWidth,
      viewportHeight = window.innerHeight || document.documentElement.clientHeight,
      scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
      left, top, clientRect;

    if (typeof this.element.getBoundingClientRect === 'function') {
      clientRect = this.element.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else {
      left = this.element.offsetLeft;
      top = this.element.offsetTop + this.element.offsetHeight;
      while (( this.element = this.element.offsetParent )) {
        left += this.element.offsetLeft;
        top += this.element.offsetTop;
      }
    }

    this.calendarContainer.style.position = 'absolute';
    this.calendarContainer.style.left = left + 'px';
    this.calendarContainer.style.top = top + 'px';
  }

  destroy() {
    this.calendarContainer.remove();
  }

  /**
   * Returns date according to passed format
   *
   * @param {Date}   dt     Date object
   * @param {String} format Format string
   *      d    - day of month
   *      dd   - 2-digits day of month
   *      D    - day of week
   *      m    - month number
   *      mm   - 2-digits month number
   *      M    - short month name
   *      MM   - full month name
   *      yy   - 2-digits year number
   *      yyyy - 4-digits year number
   */
  getFormatedDate(dt, format) {
    var items = {
      d: dt.getDate(),
      dd: dt.getDate(),
      D: dt.getDay(),
      m: dt.getMonth() + 1,
      mm: dt.getMonth() + 1,
      M: dt.getMonth(),
      MM: dt.getMonth(),
      yy: dt.getFullYear().toString().substr(-2),
      yyyy: dt.getFullYear()
    };

    items.dd < 10 && ( items.dd = '0' + items.dd );
    items.mm < 10 && ( items.mm = '0' + items.mm );
    items.D = datepicker_langs[this.options.lang].weekdays[items.D ? items.D - 1 : 6];
    items.M = datepicker_langs[this.options.lang].monthsShort[items.M];
    items.MM = datepicker_langs[this.options.lang].months[items.MM];

    return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function (m) {
      return typeof items[m] !== 'undefined' ? items[m] : m;
    });
  }

  /**
   * Returns true if date picker is visible now
   *
   * @returns {Boolean}
   */
  isActive() {
    return this.calendarContainer.classList.contains('is-active');
  }

  isDate(obj) {
    return ( /Date/ ).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  }

  isLeapYear(year) {
    // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  getDaysInMonth(year, month) {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  compareDates(a, b) {
    // weak date comparison (use setToStartOfDay(date) to ensure correct result)
    return a.getTime() === b.getTime();
  }
}
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
var Stripe;
if (Stripe !== undefined) {
  // Create a Stripe client
  var stripe = Stripe('pk_test_8fWi3COBUMFME9SSpFHSNBr7');
  // Create an instance of Elements
  var elements = stripe.elements();

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
  };

  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.classList.add('is-danger');
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  // Handle form submission
  var form = document.getElementById('booking_stepThree');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        console.log(result.token);
        stripeTokenHandler(result.token);
      }
    });
  });

  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('booking_stepThree');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
  }
}
jQuery(function($){

  var createdAt = document.querySelector('[data-createdat]').dataset.createdat
  var liveTime = 20;
  var endTime = new Date(createdAt)
  endTime.setMinutes(endTime.getMinutes() + liveTime)
  var minutes = $('#timer_minutes')
  var seconds = $('#timer_seconds')

  setDate()

  function setDate() {
    var now = new Date()
    var s = ((endTime.getTime() - now.getTime())/1000)
    // UTC
    // var s = ((endTime.getTime() - now.getTime())/1000) - now.getTimezoneOffset()*60

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

    setTimeout(setDate,1000);

  }

})
