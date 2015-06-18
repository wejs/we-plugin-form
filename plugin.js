/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs({

  // });

  // ser plugin routes
  plugin.setRoutes({
  });

  plugin.setHelpers({
    'form':  __dirname + '/server/helpers/form.js'
  });

  plugin.setTemplates({
    'forms/form': __dirname + '/server/templates/forms/form.hbs',
    'forms/password': __dirname + '/server/templates/forms/password.hbs',
    'forms/text': __dirname + '/server/templates/forms/text.hbs',
    'forms/submit': __dirname + '/server/templates/forms/submit.hbs'
  });

  plugin.events.on('we:after:load:plugins', function (we) {
    we.form = {
      // loaded forms
      forms: {}
    };
  });

  plugin.events.on('we:after:load:controllers', function(we) {
    for (var formName in we.config.forms) {
      we.form.forms[formName] = require(we.config.forms[formName]);
    }
  });

  return plugin;
};