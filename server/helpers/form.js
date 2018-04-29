/**
 * Render we.js form
 *
 * usage: {{{form formName data validationError}}}
 */
const crypto = require('crypto');

module.exports = function(we) {
  /**
   * Form json helper
   * @param  {String} formName Form name, ex: user
   * @param  {Object} values    Ex: record object from sequelize result
   * @param  {Object} errors    res.locals.validationError variable
   * @return {String}           html
   */
  return function renderFormHelper (formName, values, errors) {
    if (!we.form.forms[formName]) {
      we.log.warn('form '+ formName + ' not found in we.form object.');
      return '';
    }

    let uuid = crypto.randomBytes(20).toString('hex');

    let options = arguments[arguments.length-1];
    if (!errors) errors = {};

    let formId = formName + '-' + uuid;
    if (!values) values = {};

    let theme = options.data.root.theme;
    if (!theme) theme = we.view.themes[we.view.appTheme];

    let html = '';
    let fields = '<div class="we-form-fields">';
    let attr, attrs, attrName;

    const locals = (options.hash.locals || options.data.root);

    // form fields
    attrs = we.form.forms[formName].fields;
    for (attrName in attrs) {
      attr = attrs[attrName];
      if (!attr) continue;// skip if this attr is null
      fields += we.form.renderField (
        attrName,
        attr,
        attrs,
        values,
        errors,
        theme,
        locals,
        formId,
        formName
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
          attrName,attr, attrs, values, errors, theme, locals, formId, formName
        );
      }
      // close we.js form actions
      fields += '</div>';
    }

    let controllAttrs = '';
    if (we.form.forms[formName].actionType) {
      controllAttrs += ' we-submit="'+we.form.forms[formName].actionType+'" ';
    }

    fields += we.form.renderRedirectField(locals);

    html += we.view.renderTemplate('forms/form', theme, {
      formId: formId,
      formName: formName,
      form: we.form.forms[formName],
      action: options.hash.action || we.form.forms[formName].action,
      fields: fields,
      enctype: we.form.forms[formName].enctype || 'application/x-www-form-urlencoded',
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs,
      locals: locals,
      uuid: uuid
    });

    return new we.hbs.SafeString(html);
  }
}
