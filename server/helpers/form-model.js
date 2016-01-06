/**
 * Render we.js model form
 *
 * Usage: {{{form-model model data validationError}}}
 */

module.exports = function(we) {
  /**
   * Form model helper
   * @param  {String} modelName Model name, ex: user
   * @param  {Object} values    Ex: record object from sequelize result
   * @param  {Object} errors    res.locals.validationError variable
   * @return {String}           html
   */
  return function renderFormModelHelper(modelName, values, errors) {
    if (!we.form.varlidFormHelperAttrs(arguments)) return '';
    // set vars
    var options, action, formId, theme, attrs, attr, destroyLink;
    var fields = '', controllAttrs = '';

    options = arguments[arguments.length-1];
    if (arguments.length < 4 || !errors) errors = {};

    if (!values) values = {};

    action = (
      we.db.modelsConfigs[modelName].formAction ||
      options.data.root.req.originalUrl ||
      options.data.root.req.url
    );

    formId = modelName;
    // get theme naem
    theme = options.data.root.theme || we.view.themes[we.view.appTheme].name;

    attrs = we.db.modelsConfigs[modelName].definition;
    // get fields html
    for (var attrName in attrs) {
      attr = attrs[attrName];
      if (!attr) continue;// skip if this attr is null
      fields += we.form.renderField (
        attrName, attr, attrs, values, errors, theme, options.data.root, formId, modelName, true
      );
    }

    if (we.db.models[modelName].options.enableAlias &&
      we.acl.canStatic('setAlias', options.data.root.req.userRoleNames)
    ) {
      fields += we.form.renderField (
        'setAlias', {
          linkPermanent: we.router.alias.forPath('/'+modelName+'/'+values.id),
          formFieldType: 'url-alias'
        }, attrs, values, errors, theme, options.data.root, formId, modelName, true
      );
    }

    fields += we.form.renderRedirectField(options.data.root);

    // if is one sequelize record and have getUrlPath:
    if (values.getUrlPath) {
      destroyLink = values.getUrlPath() + '/delete';
      if (options.data.root.redirectTo)
        destroyLink +='?redirectTo='+ options.data.root.redirectTo;
    }

    var formCfgs = {
      formId: formId,
      modelName: modelName,
      action: action,
      fields: fields,
      context: this,
       __: this.__ ,
      controllAttrs: controllAttrs,
      locals: options.data.root,
      editDateFields: false,
      values: values,
      destroyLink: destroyLink
    }

    // add createdAt and updatedAt fields if have permissions
    if (we.acl.canStatic(modelName+'-edit-field-createdAt', options.data.root.req.userRoleNames)) {
      formCfgs.fieldCreatedAt = we.form.renderField (
        'updatedAt', {
          formFieldType: 'date'
        }, attrs, values, errors, theme, options.data.root, formId, modelName, true
      );
    }
    if (we.acl.canStatic(modelName+'-edit-field-updatedAt', options.data.root.req.userRoleNames)) {
      formCfgs.fieldUpdatedAt = we.form.renderField (
        'createdAt', {
          formFieldType: 'date'
        }, attrs, values, errors, theme, options.data.root, formId, modelName, true
      )
    }

    if (formCfgs.fieldCreatedAt || formCfgs.fieldUpdatedAt)
      formCfgs.editDateFields = true;

    return new we.hbs.SafeString(we.view.renderTemplate('forms/form-model', theme, formCfgs));
  }
}
