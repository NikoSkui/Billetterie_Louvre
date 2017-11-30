jQuery(function($){

  var createdAt = document.querySelector('[data-createdat]').dataset.createdat
  var liveTime = 20
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

    setTimeout(setDate,1000)

  }

})
