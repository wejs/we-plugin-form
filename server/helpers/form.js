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
    if (!theme) theme = we.view.themes[we.view.appTheme];

    var html = '';
    var fields = '<div class="we-form-fields">';
    var attr, attrs, attrName;

    // form fields
    attrs = we.form.forms[formName].fields;
    for (attrName in attrs) {
      attr = attrs[attrName];
      fields += we.form.renderField (
        attrName,attr, attrs, values, errors, theme, options.data.root, formId, formName
      );
    }
    // close we.js form fields
    fields += '</div>';

    // action fields
    if (we.form.forms[formName].actions) {
      attrs = we.form.forms[formName].actions;
      fields += '<div class="we-form-actions">';
      for (attrName in attrs) {
        attr = attrs[attrName];
        fields += we.form.renderField (
          attrName,attr, attrs, values, errors, theme, options.data.root, formId, formName
        );
      }
      // close we.js form actions
      fields += '</div>';
    }

    var controllAttrs = '';
    if (we.form.forms[formName].actionType) {
      controllAttrs += ' we-submit="'+we.form.forms[formName].actionType+'" ';
    }

    if (options.data.root.redirectTo) {
      fields += '<input name="redirectTo" type="hidden" value="'+options.data.root.redirectTo+'">'
    }

    html += we.view.renderTemplate('forms/form', theme, {
      formId: formId,
      formName: formName,
      form: we.form.forms[formName],
      fields: fields,
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs,
      locals: options.data.root
    });

    return html;
  }
}
