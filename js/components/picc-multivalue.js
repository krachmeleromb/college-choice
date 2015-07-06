(function(exports) {

  var picc = exports.picc || (exports.picc = {});

  picc.multivalue = function() {

    var multivalue = function(selection) {
      var value = d3.functor(null);

      selection.each(function() {
        console.log('multivalue:', this);

        var group = d3.select(this);
        var button = group.select('.button-add');
        var input = group.select('[name="' + button.attr('data-input') + '"]');
        var isSelect = input.property('type').match(/^select/);

        button.on('click.multivalue', function() {
          d3.event.preventDefault();
          var val = input.property('value');
          add(input.property('value'));
        });

        var values = value.call(this, input.attr('name'));
        if (values) {
          if (!Array.isArray(values)) values = [values];
          values.forEach(add);
          input.property('value', '');
        }

        function add(value) {
          if (!value) return;

          var avatar = group.append(function() {
            var h = document.createElement('input');
            h.setAttribute('type', 'hidden');
            h.setAttribute('name', input.attr('name'));
            h.value = input.property('value');
            return h;
          });

          var x = group.append('button')
            .attr('class', 'button button-remove')
            .html('&times; <span class="value"></span>')
            .on('click', function() {
              d3.event.preventDefault();
              avatar.remove();
              x.remove();

              if (isSelect) {
                input.call(enableOption, value);
              }
            });

          var text = isSelect
            ? selectedOptionText(input.node())
            : input.text();
          x.select('.value').text(text);
          if (isSelect) {
            input.call(disableOption, value);
          }
          input.property('value', '');
        }
      });
    };

    multivalue.value = function(v) {
      if (!arguments.length) return value;
      value = d3.functor(v);
      return multivalue;
    };

    function selectedOptionText(input) {
      for (var i = 0, len = input.options.length; i < len; i++) {
        var option = input.options[i];
        if (option.selected) {
          return option.textContent || option.value;
        }
      }
      return '';
    }

    function disableOption(select, value) {
      select.selectAll('option')
        .filter(function() {
          return this.value == value;
        })
        .attr('disabled', 'disabled');
    }

    function enableOption(select, value) {
      select.selectAll('option')
        .filter(function() {
          return this.value == value;
        })
        .attr('disabled', null);
    }

    return multivalue;
  };

  window.addEventListener('load', function() {
    d3.selectAll('.picc-multivalue')
      .call(picc.multivalue())
      .on('add', function() {
        var af = this.querySelector('[autofocus]');
        if (af) af.focus();
      });
  });

})(this);
