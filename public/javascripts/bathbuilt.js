$(document).ready(function() {

  var validatedOrderFields = {
    email: 'empty',
    phone: 'empty'
  }

  var validatedCustomizeFields = {
    email: 'empty',
    phone: 'empty',
    details: 'empty'
  }

  if($('#stainsOption').length) {
    validatedOrderFields.stains = 'empty'
    validatedCustomizeFields.stains = 'empty'
  }

  if($('#materialsOption').length) {
    validatedOrderFields.materials = 'empty'
    validatedCustomizeFields.materials = 'empty'
  }

  if($('#sizeOption').length) {
    validatedOrderFields.size = 'empty'
    validatedCustomizeFields.size = 'empty'
  }

  $('#orderForm')
  .form({
    fields: validatedOrderFields,
    inline: true,
    on: blur
  })

  $('#customizeForm')
  .form({
    fields: validatedCustomizeFields,
    inline: true,
    on: blur
  })

  $('#toggle-sidebar').click(function(e) {
    e.preventDefault()
    $('.ui.sidebar').sidebar('toggle')
  })

  $('#toggle-modal-order').click(function(e) {
    e.preventDefault()
    $('#modal-order').modal('show')
  })

  $('#toggle-modal-customize').click(function(e) {
    e.preventDefault()
    $('#modal-customize').modal('show')
  })

  $('.ui.dropdown').dropdown();

  $('.chameleon.text.menu.desktop .product').popup({
    popup: '.fluid.popup.bottom',
    target: '#universal',
    position: 'bottom left',
    inline   : false,
    hoverable: true,
    lastResort: 'bottom left',
    on: 'click',
    delay: {
      show: 300,
      hide: 60000
    }
  });

  // change color of menu when passed
  $('.masthead').visibility({
    once: false,
    onBottomPassed: function() {
      console.log('bye masthead')
      $('.chameleon').addClass('passed')
      $('.chameleon-logo').attr('src', '/images/logo/BathBuiltBlack.png')
    },
    onBottomPassedReverse: function() {
      console.log('hi masthead')
      $('.chameleon').removeClass('passed')
      $('.chameleon-logo').attr('src', '/images/logo/bathbuilt128.png')
    }
  })

  // center cover text
  centerCover()
  centerMusk()
  // adjust cat
  adjustCatHeight()

  $(window).resize(function() {
    centerCover()
    centerMusk()
    adjustCatHeight()
  })

  // create sidebar and attach to menu open
  //$('.ui.sidebar').sidebar('attach events', '.toc.item')

  $('.alternative-image').click(function() {
    var altsrc = $(this).attr('src')
    $('.main-image').attr('src', altsrc)
  })

  window.sr = ScrollReveal();
  sr.reveal('.screv');

})

function centerMusk() {
  var mh = $('.musk').height()
  var mp = parseInt($('.musk').css('padding-top'), 10)
  var mhh = parseInt($('.musk-header').css('height'), 10)
  var margin = (mh - mhh)/2
  console.log(mh)
  console.log(mp)
  console.log(mhh)
  console.log(margin)
  $('.musk-header').css('margin-top', margin+'px')
}

function centerCover() {
  var vh = $(window).height()
  var mh = parseInt($('.chameleon').css('height'), 10)
  var tp = parseInt($('.masthead').css('padding-top'), 10)
  var cth = parseInt($('#cover-text').css('height'), 10)
  //var margin = (vh - cth)/2 - mh - tp
  var margin = (vh - cth) - (/*mh +*/ 3*tp)
  console.log(vh)
  console.log(mh)
  console.log(tp)
  console.log(cth)
  $('#cover-text').css('margin-top', margin+'px')
}

function centerCat(context) {
  var mh = $(context).height()
  var mp = parseInt($(context).css('padding-top'), 10)
  var mhh = parseInt($('.cat-header', context).css('height'), 10)
  var margin = (mh - mhh)/2
  console.log(mh)
  console.log(mp)
  console.log(mhh)
  console.log(margin)
  $('.cat-header', context).css('margin-top', margin+'px')
}

function adjustCatHeight() {
  var max = 0

  // find max height
  $('.cat').each(function(i, obj) {
    $(this).height('auto')
    if($(this).height() >= max) {
      max = $(this).height()
    }
  })

  // apply max height
  $('.cat').each(function(i, obj) {
    if($(this).height() < max) {
      $(this).height(max)
      centerCat(this)
    }
  })
}
