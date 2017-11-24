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

  renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut) {
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

      var dateTicket = new Date(ticketDateElement.text())

      if (dateTicket != 'Invalid Date' && _this.hasTicket == 0 ) {
        _this.hasTicket = 1;
        addTicket();
      }
     
      if (_this.options.closeOnSelect) {
        _this.hide();
      }

    });

    newDay.appendChild(newDayButton);
    newDayContainer.classList.add('calendar-date');
    newDayContainer.appendChild(newDay);


    newDay.classList.add('calendar-date');
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
        isDisabled = false;

      if (!isSelected) {
        isSelectedIn = false;
        isSelectedOut = false;
      }

      if (day.getMonth() !== this.month ||
        day < now
      ) {
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
        var $elementFormCible = $('#booking_stepOne_'+id);

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