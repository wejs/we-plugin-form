/**
 * Add form client side logic
 */

window.addEventListener('WebComponentsReady', function() {
  var WeCheckboxPrototype = Object.create(HTMLElement.prototype);
  WeCheckboxPrototype.createdCallback = function createdCallback() {
    this.selector = this.children[0];
    this.dataField = this.children[1];

    this.selector.addEventListener('change', this.onChangeCheckedValue.bind(this));
  };

  WeCheckboxPrototype.onChangeCheckedValue = function onChangeCheckedValue() {
    if (this.selector.checked) {
      this.dataField.setAttribute('value', 'true')
    } else {
      this.dataField.setAttribute('value', 'false');
    }
  }

  document.registerElement('we-checkbox', {
    prototype: WeCheckboxPrototype
  });

  var WeDatetiemPickerPrototype = Object.create(HTMLElement.prototype);
  WeDatetiemPickerPrototype.createdCallback = function() {
    var self = this;

    var viewformat = this.dataset.viewformat;

    var $element = $(self);

    var $input = $element.children('input');
    var input = $input[0];

    var $viewInput = $input.clone();

    input.type = 'hidden';
    input.removeAttribute('value');
    // add disabled attr to skip post if not changed
    input.setAttribute('disabled', 'disabled');

    $viewInput.removeAttr('name');
    $viewInput.attr('id', $viewInput[0].id + '-picker');

    var $wrapper = $('<div class="row"><div class="col-sm-12"></div></div>');
    $wrapper.children().append($viewInput);

    $element.append($wrapper);

    if (self.dataset.maxDate) {
      var d = new Date(self.dataset.maxDate);
      self.dataset.maxDate = d.toISOString();
    }

    // add the datepicker
    $(function() {
      $viewInput.datetimepicker({
        format: viewformat,
        // minDate: self.dataset.minDate,
        maxDate: self.dataset.maxDate,
        locale: window.WE_BOOTSTRAP_CONFIG.locale || 'en-us'
      })
      .on('dp.change', function onChangeViewInput(e) {
        if (e.date) {
          input.removeAttribute('disabled');
          input.value = e.date.toISOString();
        } else {
          input.setAttribute('disabled', 'disabled');
          input.value = '';
        }
      });
    });
  };

  document.registerElement('we-datetime-picker', {
    prototype: WeDatetiemPickerPrototype
  });

});