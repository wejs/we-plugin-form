/**
 * We.js form feature, see plugin.js file
 */

var _ = require('lodash');
module.exports = function(we) {
  return {
    // loaded forms
    forms: {},
    resolveField: {
      'VARCHAR': 'text',
      'TEXT': 'textarea',
      'DATETIME': 'date',
      'BIGINT': 'number',
      'TINYINT': 'number',
      'BOOLEAN': 'boolean',
      'INTEGER': 'number'
    },

    varlidFormHelperAttrs: function varlidFormHelperAttrs(args) {
      if (!we.db.modelsConfigs[args[0]]) {
        we.log.warn('form-model model: '+ args[0] + ' not found in we.db.modelsConfigs object');
        return false;
      } else if(!we.db.modelsConfigs[args[0]].definition) {
        we.log.warn('form-model model: '+ args[0] + ' definitions not found in we.db.modelsConfigs object');
        return false
      }

      return true;
    },

    renderRedirectField: function renderRedirectField(locals) {
      if (!locals.redirectTo) return '';
      return '<input name="redirectTo" type="hidden" value="'+locals.redirectTo+'">';
    },

    getFieldType: function(attr) {
      if (attr.formFieldType) {
        return attr.formFieldType;
      } else if(attr.formFieldType === null) {
        return null;
      } else {
        var type = we.form.resolveField[attr.type.toString().split('(')[0]];
        if (!type) {
          type = 'text';
          we.log.warn('helper:orm-model: Cant resolve resolveField: ', attr.type.toString());
        }
        return type;
      }
    },

    renderField: function renderField(attrName, attr, attributes, values, errors, theme, locals, formId, modelName, isModel) {
      var fieldAttrs= '', type;
      var formFieldAttributes = attr.formFieldAttributes;
      if (isModel) {
        type = we.form.getFieldType(attr);
      } else {
        type = attr.type;
      }
      if (!type) return '';

      // get field value
      var value = values[attrName];
      if (!value) value = attr.defaultValue;
      if (!value) value = '';
      // get required field attr
      if (attr.allowNull === false) fieldAttrs += ' required=required';
      if (_.isObject(formFieldAttributes)) {
        _.forOwn(formFieldAttributes, function (attrValue, attrName) {
          if (!attrName || !attrValue) return;

          fieldAttrs += ' ' + attrName + '=' + attrValue + '';
        });
      }

      var fieldOptions = (attr.formFieldOptions || {});
      // use type attr
      return we.view.renderTemplate(
        'forms/' + type, theme, {
          value: value,
          values: values,
          field: attr,
          name: attrName,
          error: (errors[attrName] || null),
          formId: formId,
          fieldAttrs: fieldAttrs,
          fieldName: 'form-' + modelName + '-' + attrName,
          fieldId: formId + '-' + attrName,
          placeholder: 'form-placeholder-' + modelName + '-' + attrName,
          fieldOptions: fieldOptions,
          help: 'form-helper-' + modelName + '-' + attrName,
          __: locals.__,
          locals: locals
        }
      );
    }
  };
};