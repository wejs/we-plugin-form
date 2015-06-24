/**
 * Render we.js form
 *
 * usage: {{{form formName valuesObject}}}
 */

module.exports = function(we) {
  return function form (formName, values, errors) {
    if (!we.form.forms[formName]) {
      we.log.warn('form '+ formName + ' not found in we.form object.');
      return '';
    }

    var options = arguments[arguments.length-1];
    if (!errors) errors = {};

    var formId = formName;
    if (!values) values = {};

    var theme = options.data.root.theme;
    if (!theme) theme = 'app';
    var html = '';
    var fields = '';
    var type, attr, value, fieldAttrs;

    for ( var attrName in we.form.forms[formName].fields) {
      attr = we.form.forms[formName].fields[attrName];
      type = typeof attr;
      value = values[attrName];
      if (!value) value = '';

      fieldAttrs = '';

      if (!value) value = attr.defaultValue;
      if (!value) value = '';


      if (attr.allowNull === false) {
        fieldAttrs += ' required="required"';
      }

      // use type attr
      fields += we.view.renderTemplate(
        'forms/' + attr.type, theme,
        {
          value: value,
          field: attr,
          name: attrName,
          error: (errors[attrName] || null),
          formId: formId,
          fieldName: 'form-' + formName + '-' + attrName,
          fieldId: formId + '-' + attrName,
          placeholder: 'form-placeholder-' + formName + '-' + attrName,
          __: this.__
        }
      );
    }

    var controllAttrs = '';
    if (we.form.forms[formName].actionType) {
      controllAttrs += ' we-submit="'+we.form.forms[formName].actionType+'" ';
    }

    html += we.view.renderTemplate('forms/form', theme, {
      formId: formId,
      formName: formName,
      form: we.form.forms[formName],
      fields: fields,
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs
    });

    return html;
  }
}