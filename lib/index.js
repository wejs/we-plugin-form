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
      if (attr.type === 'field-group') {
        return this.renderFieldGroup(...arguments);
      }

      let type;

      const formFieldAttributes = (attr.formFieldAttributes || {});
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

      let fieldAttrs = this.getFieldAttributes(formFieldAttributes, attr);

      const fieldName = 'form-' + modelName + '-' + attrName;
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
          label: this.getFieldLabel(fieldName, modelName, attrName, attr, locals),
          fieldAttrs: fieldAttrs,
          fieldName: fieldName,
          fieldId: formId + '-' + attrName,
          placeholder: this.getFieldPlaceholder(fieldName, modelName, attrName, attr, locals),
          fieldOptions: fieldOptions,
          help: this.getFieldHelp(fieldName, modelName, attrName, attr, locals),
          __: locals.__,
          locals: locals
        }
      );
    },

    /**
     * Form field group
     *
     * Group form field not is avaible to model forms
     *
     * @param  {String}  attrName     Group field/attr name
     * @param  {Object}  groupField   Current field group configuration
     * @param  {Object}  parentFields Form or parent group fields
     * @param  {Object}  values       Form values by id
     * @param  {Object}  errors       Form errors
     * @param  {String]}  theme       Theme name
     * @param  {Object}  locals       res.locals
     * @param  {String}  formId       Form unique ID
     * @param  {String}  formName     Form name
     * @param  {Boolean} isModel      True is is model form
     * @return {String]}              Fields html in string format
     */
    renderFieldGroup(attrName, groupField, parentFields, values, errors, theme, locals, formId, formName, isModel) {

      if (isModel) return '';

      let fieldsHTML = '';
      // form fields
      const groupFields = groupField.fields;

      for (let subFieldName in groupFields) {
        let subFieldAttr = groupFields[subFieldName];
        if (!subFieldAttr) continue;// skip if this sub field attributes is null
        fieldsHTML += we.form.renderField (
          subFieldName,
          subFieldAttr,
          groupFields,
          values,
          errors,
          theme,
          locals,
          formId,
          formName,
          isModel
        );
      }

      const fieldAttrs = this.getFieldAttributes(groupField.formFieldAttributes, groupField);
      const fieldName = 'form-' + formName + '-g-' + attrName;

      return we.view.renderTemplate(
        'forms/' + groupField.type, theme, {
          field: groupField,
          name: attrName,
          title: groupField.title,
          description: groupField.description,
          formId: formId,
          fieldAttrs: fieldAttrs,
          fieldName: fieldName,
          fieldId: formId + '-' + attrName,
          fieldsHTML: fieldsHTML,
          __: locals.__,
          locals: locals
        }
      );
    },

    getFieldAttributes(formFieldAttributes, field) {
      let fieldAttrs = '';

      // get required field attr
      if (field.allowNull === false) fieldAttrs += ' required=required';

      if (_.isObject(formFieldAttributes)) {
        _.forOwn(formFieldAttributes, (attrValue, attrName)=> {
          if (
            !attrName ||
            !attrValue ||
            attrName === 'help' ||
            attrName === 'label'
          ) {
            return; // skip help attr show in other tag
          }

          fieldAttrs += ' ' + attrName + '="' + attrValue + '"';
        });
      }

      return fieldAttrs;
    },

    getFieldLabel(fieldName, modelName, attrName, attr, locals) {
      if (
        attr.formFieldAttributes &&
        attr.formFieldAttributes.label !== undefined
      ) {
        return attr.formFieldAttributes.label;
      } else {
        return locals.__(fieldName);
      }
    },

    getFieldHelp(fieldName, modelName, attrName, attr, locals) {
      if (
        attr.formFieldAttributes &&
        attr.formFieldAttributes.help !== undefined
      ) {
        return attr.formFieldAttributes.help;
      } else {
        return locals.__('form-helper-' + modelName + '-' + attrName);
      }
    },

    getFieldPlaceholder(fieldName, modelName, attrName, attr, locals) {
      if (
        attr.formFieldAttributes &&
        attr.formFieldAttributes.placeholder !== undefined
      ) {
        return attr.formFieldAttributes.placeholder;
      } else {
        return locals.__('form-placeholder-' + modelName + '-' + attrName);
      }
    }
  };
};