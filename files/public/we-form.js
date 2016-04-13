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
});