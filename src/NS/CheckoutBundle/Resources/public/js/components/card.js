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