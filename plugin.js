/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
var form = require('./lib');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs({
  // });
  // set plugin routes
  // plugin.setRoutes({});

  plugin.setHelpers({
    'form':  __dirname + '/server/helpers/form.js',
    'form-model':  __dirname + '/server/helpers/form-model.js',
    'field-help-error': __dirname + '/server/helpers/field-help-error.js'
  });

  plugin.setTemplates({
    'forms/form-model': __dirname + '/server/templates/forms/form-model.hbs',
    'forms/form': __dirname + '/server/templates/forms/form.hbs',
    'forms/password': __dirname + '/server/templates/forms/password.hbs',
    'forms/text': __dirname + '/server/templates/forms/text.hbs',
    'forms/submit': __dirname + '/server/templates/forms/submit.hbs',
    'forms/date': __dirname + '/server/templates/forms/date.hbs',
    'forms/number': __dirname + '/server/templates/forms/number.hbs',
    'forms/textarea': __dirname + '/server/templates/forms/textarea.hbs',
    'forms/select': __dirname + '/server/templates/forms/select.hbs',
    'forms/html': __dirname + '/server/templates/forms/html.hbs',
    'forms/boolean': __dirname + '/server/templates/forms/boolean.hbs',
    'forms/email': __dirname + '/server/templates/forms/email.hbs',
    'btn-modal-delete': __dirname + '/server/templates/forms/btn-modal-delete.hbs',
    'btn-modal-save': __dirname + '/server/templates/forms/btn-modal-save.hbs',
    'forms/break': __dirname + '/server/templates/forms/break.hbs',
    'forms/terms-of-use': __dirname + '/server/templates/forms/terms-of-use.hbs',
    'forms/static-text':  __dirname + '/server/templates/forms/static-text.hbs'
  });

  plugin.events.on('we:after:load:plugins', function (we) {
    we.form = form(we);
  });

  plugin.events.on('we:after:load:controllers', function(we) {
    for (var formName in we.config.forms) {
      we.form.forms[formName] = require(we.config.forms[formName]);
    }

    plugin.events.emit('we:after:load:forms', we);
  });

  return plugin;
};
