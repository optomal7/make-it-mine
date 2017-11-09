console.log("Sanity Check: JS is working!");

$(document).ready(function(){
  $('#edit').hide()
  $('#magic').hide()
  $('#length').hide()

  $(document).on('click', '#length-button', function() {
    $('#length').show()
    $('#edit').hide()
    $('#magic').hide()

  })

  $(document).on('click', '#edit-button', function() {
    $('#length').hide()
    $('#magic').hide()
    $('#edit').show()
  })

  $(document).on('click', '#magic-button', function() {
    $('#length').hide()
    $('#edit').hide()
    $('#magic').show()
  })
});
