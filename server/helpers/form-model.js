/**
 * Render we.js model form
 *
 * usage: {{{form-model modelName modelValue}}}
 */
module.exports = function(we) {
  return function renderHelper(modelName, values, errors) {
    if (!we.form.varlidFormHelperAttrs(arguments)) return '';
    // set vars
    var options, action, formId, theme, attrs, attr;
    var fields = '', controllAttrs = '';

    options = arguments[arguments.length-1];
    if (arguments.length < 4 || !errors) errors = {};

    if (!values) values = {};

    action = we.db.modelsConfigs[modelName].formAction;
    if (!action) action = (options.data.root.req.originalUrl || options.data.root.req.url);

    formId = modelName;
    // get theme naem
    theme = options.data.root.theme;
    if (!theme) theme = we.view.themes[we.view.appTheme].name;

    attrs = we.db.modelsConfigs[modelName].definition;
    // get fields html
    for (var attrName in attrs) {
      attr = attrs[attrName];
      if (!attr) continue;// skip if this attr is null
      fields += we.form.renderField (
        attrName, attr, attrs, values, errors, theme, options.data.root, formId, modelName, true
      );
    }

    fields += we.form.renderRedirectField(options.data.root);

    if (options.data.root.redirectTo) {
      fields += '<input name="redirectTo" type="hidden" value="'+options.data.root.redirectTo+'">'
    }

    return we.view.renderTemplate('forms/form-model', theme, {
      formId: formId,
      modelName: modelName,
      action: action,
      fields: fields,
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs,
      locals: options.data.root
    });
  }
}
