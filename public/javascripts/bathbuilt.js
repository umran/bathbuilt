$(document).ready(function() {

  $('#sizeOption').change(function() {
    setTimeout(function() {
      getPrice()
    }, 500)
  })

  $('#materialsOption').change(function() {
    setTimeout(function() {
      getPrice()
    }, 500)
  })

  var validatedOrderFields = {
    email: 'empty',
    phone: 'empty'
  }

  var validatedCustomizeFields = {
    email: 'empty',
    phone: 'empty',
    details: 'empty'
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

    // conditions
    if ($('#default-size').length > 0 && !$('#default-size').val()) {
      console.log('size is an option, but not selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a size')
      $('#choice-error').removeClass('hidden')

    } else if ($('#default-stain').length > 0 && !$('#default-stain').val()) {
      console.log('stain is an option but has not been selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a stain')
      $('#choice-error').removeClass('hidden')

    } else if ($('#default-material').length > 0 && !$('#default-material').val()) {
      console.log('material is an option but has not been selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a material')
      $('#choice-error').removeClass('hidden')

    } else {
      $('#choice-error').addClass('hidden')
      $('#modal-order').modal('show')
    }
  })

  $('#toggle-modal-customize').click(function(e) {
    e.preventDefault()

    // conditions
    /*if ($('#default-size').length > 0 && !$('#default-size').val()) {
      console.log('size is an option, but not selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a size')
      $('#choice-error').removeClass('hidden')

    } else if ($('#default-stain').length > 0 && !$('#default-stain').val()) {
      console.log('stain is an option but has not been selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a stain')
      $('#choice-error').removeClass('hidden')

    } else if ($('#default-material').length > 0 && !$('#default-material').val()) {
      console.log('material is an option but has not been selected')
      //display alert prompting user to select a size
      $('#choice-error-message').text('Please select a material')
      $('#choice-error').removeClass('hidden')

    } else {
      $('#choice-error').addClass('hidden')
      $('#modal-customize').modal('show')
    }*/

    $('#choice-error').addClass('hidden')
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
  //adjustCatHeight()

  $(window).resize(function() {
    centerCover()
    centerMusk()
    //adjustCatHeight()
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

/*function centerCover() {
  var vh = $(window).height()
  var mh = parseInt($('.chameleon').css('height'), 10)
  var tp = parseInt($('.masthead').css('padding-top'), 10)
  var cth = parseInt($('#cover-text').css('height'), 10)
  //var margin = (vh - cth)/2 - mh - tp
  var margin = (vh - cth) - (3*tp)
  console.log(vh)
  console.log(mh)
  console.log(tp)
  console.log(cth)
  $('#cover-text').css('margin-top', margin+'px')
}*/

function centerCover() {
  var vh = $('.masthead').height()
  var mh = parseInt($('.chameleon').css('height'), 10)
  var ml = parseInt($('#cover-text').css('margin-left'), 10)
  var cth = parseInt($('#cover-text').css('height'), 10)
  var paddingcolumn = parseInt($('#masthead-text').css('padding-bottom'), 10)
  var margin = (vh - cth - ml + 3*paddingcolumn)
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

// form functions
$('#orderForm').submit(function(e) {

  if(!$('#email-order').val() || !$('#phone-order').val()) {
    console.log('some fields not complete')
    return
  }

  var formData = {
    product: $('#product-order').val(),
    custom: false,
    email: $('#email-order').val(),
    phone: $('#phone-order').val()
  }

  if ($('#default-size').length > 0) {
    formData.size = $('#default-size').val()
  }

  if ($('#default-stain').length > 0) {
    formData.stain = $('#default-stain').val()
  }

  if ($('#default-material').length > 0) {
    formData.material = $('#default-material').val()
  }

  console.log(formData.size)
  submitForm(formData)

  e.preventDefault()
})

$('#customizeForm').submit(function(e) {

  if(!$('#email-customize').val() || !$('#phone-customize').val() || !$('#details-customize').val()) {
    console.log('some fields not complete')
    return
  }

  var formData = {
    product: $('#product-customize').val(),
    custom: true,
    email: $('#email-customize').val(),
    phone: $('#phone-customize').val(),
    details: $('#details-customize').val()
  }

  if ($('#default-size').length > 0) {
    formData.size = $('#default-size').val()
  }

  if ($('#default-stain').length > 0) {
    formData.stain = $('#default-stain').val()
  }

  if ($('#default-material').length > 0) {
    formData.material = $('#default-material').val()
  }

  console.log(formData.size)
  submitForm(formData)

  e.preventDefault()
})

function submitForm(formData) {
  $.ajax({
    type: "POST",
    url: "/new-order",
    data: formData,
    success: function(data){
      if(data.status == 'success') {
        // close current modal and display new modal
        $('.ui.modal').modal('hide all')
        $('#final-message').addClass('positive')
        $('#final-message-text').text(data.message)
        $('#modal-final').modal('show')
      } else {
        // close current modal and display new modal
        $('.ui.modal').modal('hide all')
        $('#final-message').addClass('negative')
        $('#final-message-text').text(data.message)
        $('#modal-final').modal('show')
      }
    }
  })
}

function getPrice() {
  var formData = {
    product_id: $('#product-id').val()
  }

  if($('#sizeOption .selected').attr('data-idd')) {
    formData.size_id = $('#sizeOption .selected').attr('data-idd')
  }

  if($('#materialsOption .selected').attr('data-idd')) {
    formData.material_id = $('#materialsOption .selected').attr('data-idd')
  }

  $.ajax({
    type: "POST",
    url: "/get-price",
    data: formData,
    success: function(data){
      if(data.status == 'success') {
        // change price
        $('#price').text('$' + data.response.entry.fields.price['en-US'])
      } else {
        // revert to default
        $('#price').text('To display price, select options below')
      }
    }
  })
}
