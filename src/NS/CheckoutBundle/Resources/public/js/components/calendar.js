var now = null
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
    }

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.')
    }

    this.parent = this.element.parentElement
    this.lang = typeof datepicker_langs[this.lang] !== 'undefined' ? this.lang : 'en'

    this.options = Object.assign({}, defaultOptions, options)

    this.hasTicket = 0
    this.ticketLouvre = null

    this.month = this.options.startDate.getMonth(),
      this.year = this.options.startDate.getFullYear(),
      this.open = false

    this.build()
  }

  build() {
    var _this = this
    var container = document.getElementById('datepicker')

    this.datePickerContainer = document.createElement('div')
    this.datePickerContainer.id = 'datePicker' + ( new Date ).getTime()
    this.datePickerContainer.classList.add('datepicker')
    this.datePickerContainer.classList.add('is-active')

    this.calendarContainer = document.createElement('div')
    this.calendarContainer.id = 'datePicker' + ( new Date ).getTime()
    this.calendarContainer.classList.add('calendar')
    this.renderCalendar()

    if (this.options.overlay) {
      var datePickerOverlay = document.createElement('div')
      datePickerOverlay.classList.add('is-overlay')
      this.datePickerContainer.appendChild(datePickerOverlay)
    }

    this.datePickerContainer.appendChild(this.calendarContainer)
    container.appendChild(this.datePickerContainer)

    this.element.addEventListener('click', function (e) {
      e.preventDefault()
      if (_this.open && _this.options.closeAfterClick === true ) {
        _this.hide()
        _this.open = false
      } else {
        _this.show()
        _this.open = true
      }
    })
  }

  /**
  * templating functions to abstract HTML rendering
  */
  renderDayName(day, abbr = false) {
    day += datepicker_langs[this.options.lang].weekStart
    while (day >= 7) {
      day -= 7
    }

    return abbr ? datepicker_langs[this.options.lang].weekdaysShort[day] : datepicker_langs[this.options.lang].weekdays[day]
  }

  renderDay(day, month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut,isRemaining) {
    var _this = this
    var newDayContainer = document.createElement('div')
    var newDay = document.createElement('div')
    var newDayButton = document.createElement('button')

    newDayButton.classList.add('date-item')
    newDayButton.innerHTML = day
    newDayButton.addEventListener('click', function (e) {
      if (typeof _this.options.onSelect != 'undefined' &&
        _this.options.onSelect != null &&
        _this.options.onSelect) {
        _this.options.onSelect(new Date(year, month, day))
      }
      _this.element.value = _this.getFormatedDate(( new Date(year, month, day) ), _this.options.dataFormat)
     
      var allDayContainer = $(".calendar-date.is-active")
      
      var ticketDateElement = $("#ticketDate")
      var ticketDateFormElement = $("#booking_stepOne_date")
      var ticketDateToElement = _this.getFormatedDate(( new Date(year, month, day) ), 'd M. yyyy')
      var ticketDateToFormElement = _this.getFormatedDate(( new Date(year, month, day) ), 'dd/mm/yyyy')


      ticketDateElement.text(ticketDateToElement)
      ticketDateFormElement.val(ticketDateToFormElement)
      allDayContainer.removeClass('is-active')
      newDayContainer.classList.add('is-active')

      if (!_this.ticketLouvre ) {
        
        var ticketLouvre = Ticket.create()
        _this.hasTicket = 1
        _this.ticketLouvre = ticketLouvre
      }
      _this.ticketLouvre.remainingToDate(ticketDateToFormElement)
     
      if (_this.options.closeOnSelect) {
        _this.hide()
      }

    })

    newDay.appendChild(newDayButton)

    if(day < 10 ) {
      day = '0' + day
    }

    newDayContainer.dataset.fulldate = day + '/' + (month+1) + '/' + year
    newDayContainer.classList.add('calendar-date')
    newDayContainer.appendChild(newDay)


    newDay.classList.add('calendar-date')
    if (isRemaining) {
      newDayContainer.dataset.remaining =''
    }
    if (isDisabled) {
      newDayContainer.dataset.disabled = ""
      newDayContainer.setAttribute('disabled', 'disabled')
    }
    if (isToday) {
      newDayContainer.classList.add('is-today')
    }
    if (isSelected) {
      newDayContainer.classList.add('is-active')
    }
    if (isBetween) {
      newDayContainer.classList.add('calendar-range')
    }
    if (isSelectedIn) {
      newDayContainer.classList.add('range-start')
    }
    if (isSelectedOut) {
      newDayContainer.classList.add('range-end')
    }

    return newDayContainer
  }

  renderNav(year, month) {
    var _this = this
    var calendarNav = document.createElement('div')
    calendarNav.classList.add('calendar-nav')

    var previousButtonContainer = document.createElement('div')
    previousButtonContainer.classList.add('calendar-nav-left')
    previousButtonContainer.dataset.navcalendar = ''
    this.previousYearButton = document.createElement('div')
    this.previousYearButton.classList.add('button')
    this.previousYearButton.classList.add('is-text')
    var previousButtonIcon = document.createElement('i')
    previousButtonIcon.classList.add('fa')
    previousButtonIcon.classList.add('fa-backward')
    this.previousYearButton.appendChild(previousButtonIcon)
    this.previousYearButton.addEventListener('click', function (e) {
      e.preventDefault()

      _this.prevYear()
    })
    if(year > now.getFullYear()) {
      previousButtonContainer.appendChild(this.previousYearButton)
    }

    this.previousMonthButton = document.createElement('div')
    this.previousMonthButton.classList.add('button')
    this.previousMonthButton.classList.add('is-text')
    var previousMonthButtonIcon = document.createElement('i')
    previousMonthButtonIcon.classList.add('fa')
    previousMonthButtonIcon.classList.add('fa-chevron-left')
    this.previousMonthButton.appendChild(previousMonthButtonIcon)
    this.previousMonthButton.addEventListener('click', function (e) {
      e.preventDefault()
      
      _this.prevMonth()
    })
    if(month > now.getMonth() || year > now.getFullYear()) {
      previousButtonContainer.appendChild(this.previousMonthButton)
    }


    var calendarTitle = document.createElement('div')
    calendarTitle.innerHTML = datepicker_langs[this.options.lang].months[month] + ' ' + year

    var nextButtonContainer = document.createElement('div')
    nextButtonContainer.classList.add('calendar-nav-right')
    nextButtonContainer.dataset.navcalendar = ''    
    this.nextMonthButton = document.createElement('div')
    this.nextMonthButton.classList.add('button')
    this.nextMonthButton.classList.add('is-text')
    var nextMonthButtonIcon = document.createElement('i')
    nextMonthButtonIcon.classList.add('fa')
    nextMonthButtonIcon.classList.add('fa-chevron-right')
    this.nextMonthButton.appendChild(nextMonthButtonIcon)
    this.nextMonthButton.addEventListener('click', function (e) {
      e.preventDefault()

      _this.nextMonth()
    })
    nextButtonContainer.appendChild(this.nextMonthButton)
    this.nextYearButton = document.createElement('div')
    this.nextYearButton.classList.add('button')
    this.nextYearButton.classList.add('is-text')
    var nextYearButtonIcon = document.createElement('i')
    nextYearButtonIcon.classList.add('fa')
    nextYearButtonIcon.classList.add('fa-forward')
    this.nextYearButton.appendChild(nextYearButtonIcon)
    this.nextYearButton.addEventListener('click', function (e) {
      e.preventDefault()

      _this.nextYear()
    })
    nextButtonContainer.appendChild(this.nextYearButton)

    calendarNav.appendChild(previousButtonContainer)
    calendarNav.appendChild(calendarTitle)
    calendarNav.appendChild(nextButtonContainer)

    return calendarNav
  }

  renderHeader() {
    var calendarHeader = document.createElement('div')
    calendarHeader.classList.add('calendar-header')

    for (var i = 0; i < 7; i++) {
      var newDay = document.createElement('div')
      newDay.classList.add('calendar-date')
      newDay.innerHTML = this.renderDayName(i, true)
      calendarHeader.appendChild(newDay)
    }

    return calendarHeader
  }

  renderBody() {
    var calendarBody = document.createElement('div')
    calendarBody.classList.add('calendar-body')

    return calendarBody
  }

  renderCalendar() {

    var d = new Date()
    var curr_date = d.getDate()
    var curr_month = d.getMonth() //Months are zero based
    var curr_year = d.getFullYear()
    now = new Date(curr_year,curr_month,curr_date)


    var ticketDateElement = $("#ticketDate")
    if (document.getElementById( 'booking_stepOne_date' )) {
      var ticketDateFormElement = document.getElementById( 'booking_stepOne_date' ).value
      if (ticketDateFormElement) {
        this.hasTicket = 1
        var date = ticketDateFormElement.split('/')
        var ticketDateToElement = this.getFormatedDate(( new Date(date[2],date[1]-1,date[0]) ), 'd M. yyyy')
        ticketDateElement.text(ticketDateToElement)
      }
    }
    
    var ticketDateValue = new Date($("#ticketDate").text())

    var calendarNav = this.renderNav(this.year, this.month)
    var calendarHeader = this.renderHeader()
    var calendarBody = this.renderBody()

    this.calendarContainer.appendChild(calendarNav)
    this.calendarContainer.appendChild(calendarHeader)
    this.calendarContainer.appendChild(calendarBody)

    var days = this.getDaysInMonth(this.year, this.month),
      before = new Date(this.year, this.month, 1).getDay()

    if (typeof this.options.onRender != 'undefined' &&
      this.options.onRender != null &&
      this.options.onRender) {
      this.options.onRender(this)
    }

    if (datepicker_langs[this.options.lang].weekStart > 0) {
      before -= datepicker_langs[this.options.lang].weekStart
      if (before < 0) {
        before += 7
      }
    }

    var cells = days + before,
      after = cells
    while (after > 7) {
      after -= 7
    }
    cells += 7 - after
    for (var i = 0; i < cells; i++) {
      var day = new Date(this.year, this.month  , 1 + ( i - before )),
        isBetween = false,
        isSelected = this.compareDates(day, ticketDateValue),
        isSelectedIn = false,
        isSelectedOut = false,
        isToday = this.compareDates(day, now),
        isEmpty = i < before || i >= ( days + before ),
        isDisabled = false,
        isRemaining = false

      if (!isSelected) {
        isSelectedIn = false
        isSelectedOut = false
      }

      var remaining = null

      if (day.getMonth() !== this.month 
        || day < now                                      // TOUS LES JOURS AVANT AUJOURD'HUI
        || day.getDay() == 2                              // TOUS LES MARDI                 
        || (day.getDate() == 1 && day.getMonth() == 4)    // 1 MAI                        
        || (day.getDate() == 1 && day.getMonth() == 10)   // 1 NOVEMBRE
        || (day.getDate() == 25 && day.getMonth() == 11)  // 25 DECEMBRE
      ) {
        isDisabled = true
      } else {
        isRemaining = true
      }
      calendarBody.append(this.renderDay(day.getDate(), this.month, this.year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut,isRemaining))
    }
  }

  prevMonth() {
    this.month -= 1
    this.adjustCalendar()
    this.renderCalendar()
  }

  nextMonth() {
    this.month += 1
    this.adjustCalendar()
    this.renderCalendar()
  }

  prevYear() {
    this.year -= 1
    this.adjustCalendar()
    this.renderCalendar()
  }

  nextYear() {
    this.year += 1
    this.adjustCalendar()
    this.renderCalendar()
  }

  show() {
    if (typeof this.options.onOpen != 'undefined' &&
      this.options.onOpen != null &&
      this.options.onOpen) {
      this.options.onOpen(this)
    }
    this.datePickerContainer.classList.add('is-active')
    if(this.options.popUp == true) {
      this.adjustPosition()
    }
    this.open = true
  }

  hide() {
    this.open = false
    if (typeof this.options.onClose != 'undefined' &&
      this.options.onClose != null &&
      this.options.onClose) {
      this.options.onClose(this)
    }
    this.datePickerContainer.classList.remove('is-active')
  }

  adjustCalendar() {
    if (this.month < 0) {
      this.year -= Math.ceil(Math.abs(this.month) / 12)
      this.month += 12
    }
    if (this.month > 11) {
      this.year += Math.floor(Math.abs(this.month) / 12)
      this.month -= 12
    }
    this.calendarContainer.innerHTML = ''
    return this
  }

  adjustPosition() {
    var width = this.calendarContainer.offsetWidth,
      height = this.calendarContainer.offsetHeight,
      viewportWidth = window.innerWidth || document.documentElement.clientWidth,
      viewportHeight = window.innerHeight || document.documentElement.clientHeight,
      scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
      left, top, clientRect

    if (typeof this.element.getBoundingClientRect === 'function') {
      clientRect = this.element.getBoundingClientRect()
      left = clientRect.left + window.pageXOffset
      top = clientRect.bottom + window.pageYOffset
    } else {
      left = this.element.offsetLeft
      top = this.element.offsetTop + this.element.offsetHeight
      while (( this.element = this.element.offsetParent )) {
        left += this.element.offsetLeft
        top += this.element.offsetTop
      }
    }

    this.calendarContainer.style.position = 'absolute'
    this.calendarContainer.style.left = left + 'px'
    this.calendarContainer.style.top = top + 'px'
    
    this.calendarContainer.style.top = top + 'px'
  }

  destroy() {
    this.calendarContainer.remove()
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
    }

    items.dd < 10 && ( items.dd = '0' + items.dd )
    items.mm < 10 && ( items.mm = '0' + items.mm )
    items.D = datepicker_langs[this.options.lang].weekdays[items.D ? items.D - 1 : 6]
    items.M = datepicker_langs[this.options.lang].monthsShort[items.M]
    items.MM = datepicker_langs[this.options.lang].months[items.MM]

    return format.replace(/(?:[dmM]{1,2}|D|yyyy|yy)/g, function (m) {
      return typeof items[m] !== 'undefined' ? items[m] : m
    })
  }

  /**
  * Returns true if date picker is visible now
  *
  * @returns {Boolean}
  */


  isDate(obj) {
    return ( /Date/ ).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime())
  }

  isLeapYear(year) {
    // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
  }

  getDaysInMonth(year, month) {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  }

  compareDates(a, b) {
    // weak date comparison (use setToStartOfDay(date) to ensure correct result)
    return a.getTime() === b.getTime()
  }
}
