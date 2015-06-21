/**
 * Render we.js model form
 *
 * usage: {{{form-model modelName modelValue}}}
 */

module.exports = function(we) {
  return function renderHelper(modelName, values, errors) {
    if (!we.db.modelsConfigs[modelName]) {
      we.log.warn('form-model model: '+ modelName + ' not found in we.db.modelsConfigs object.');
      return '';
    }

    var options = arguments[arguments.length-1];
    if (!errors) errors = {};

    if (!we.db.modelsConfigs[modelName].definition) return '';

    var action;
    if (we.db.modelsConfigs[modelName].formAction) {
      action = we.db.modelsConfigs[modelName].formAction;
    } else {
      action = options.data.root.req.url;
    }

    var formId = modelName;

    if (!values) values = {};

    var theme = options.data.root.theme;
    if (!theme) theme = 'app';
    var html = '';
    var fields = '';
    var type, attr, fieldAttrs, fieldOptions;

    var attributes = we.db.modelsConfigs[modelName].definition;

    for (var attrName in attributes) {
      attr = attributes[attrName];
      if (attr.formFieldType) {
        type = attr.formFieldType;
      } else if(attr.formFieldType === null) {
        continue;
      } else {
        type = we.form.resolveField[attr.type.toString().split('(')[0]];
      }

      fieldAttrs = '';

      var value = values[attrName];
      if (!value) value = attr.defaultValue;
      if (!value) value = '';

      if (attr.allowNull === false) {
        fieldAttrs += ' required="required"';
      }

      fieldOptions = attr.formFieldOptions || {};
      // use type attr
      fields += we.view.renderTemplate(
        'forms/' + type, theme,
        {
          value: value,
          field: attr,
          name: attrName,
          error: (errors[attrName] || null),
          formId: formId,
          fieldAttrs: fieldAttrs,
          fieldName: 'form-' + modelName + '-' + attrName,
          fieldId: formId + '-' + attrName,
          placeholder: 'form-placeholder-' + modelName + '-' + attrName,
          fieldOptions: fieldOptions,
          __: this.__
        }
      );
    }

    var controllAttrs = '';

    html += we.view.renderTemplate('forms/form-model', theme, {
      formId: formId,
      modelName: modelName,
      action: action,
      fields: fields,
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs
    });

    return html;
  }
}
