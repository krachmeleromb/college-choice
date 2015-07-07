$(function() {

  $('select.select2').select2({
    closeOnSelect: false
  });

  d3.selectAll('.picc-accordion')
    .call(picc.accordion())
    .on('open', function() {
      var af = this.querySelector('[autofocus]');
      if (af) af.focus();
    });

});
