/**
 * We.js form feature, see plugin.js file
 */


module.exports = function(we) {
  const _ = we.utils._;

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

    varlidFormHelperAttrs(args) {
      if (!we.db.modelsConfigs[args[0]]) {
        we.log.warn('form-model model: '+ args[0] + ' not found in we.db.modelsConfigs object');
        return false;
      } else if(!we.db.modelsConfigs[args[0]].definition) {
        we.log.warn('form-model model: '+ args[0] + ' definitions not found in we.db.modelsConfigs object');
        return false
      }

      return true;
    },

    renderRedirectField(locals) {
      if (!locals.redirectTo) return '';
      return '<input name="redirectTo" type="hidden" value="'+locals.redirectTo+'">';
    },

    getFieldType(attr) {
      if (attr.formFieldType) {
        return attr.formFieldType;
      } else if(attr.formFieldType === null) {
        return null;
      } else {
        let type = we.form.resolveField[attr.type.toString().split('(')[0]];
        if (!type) {
          type = 'text';
          we.log.warn('helper:orm-model: Cant resolve resolveField: ', attr.type.toString());
        }
        return type;
      }
    },

    renderField(attrName, attr, attributes, values, errors, theme, locals, formId, modelName, isModel) {
      let fieldAttrs = '', type;
      const formFieldAttributes = attr.formFieldAttributes;
      if (isModel) {
        type = we.form.getFieldType(attr);
      } else {
        type = attr.type;
      }
      if (!type) return '';

      // get field value
      let value;
      if (values[attrName] === false) {
        value = false;
      } else {
        value = ( values[attrName] || attr.defaultValue || '');
      }

      // get required field attr
      if (attr.allowNull === false) fieldAttrs += ' required=required';

      if (_.isObject(formFieldAttributes)) {
        _.forOwn(formFieldAttributes, (attrValue, attrName)=> {
          if (!attrName || !attrValue) return;

          fieldAttrs += ' ' + attrName + '=' + attrValue + '';
        });
      }

      const fieldOptions = (attr.formFieldOptions || {});
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