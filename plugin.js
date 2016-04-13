/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
var form = require('./lib');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  // set plugin configs
  plugin.setConfigs({
    forms: {
      'login': __dirname + '/server/forms/login.json',
      'register': __dirname + '/server/forms/register.json',
      'forgot-password': __dirname + '/server/forms/forgot-password.json',
      'new-password': __dirname + '/server/forms/new-password.json',
      'change-password': __dirname + '/server/forms/change-password.json'
    }
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

  plugin.addJs('we-form', {
    type: 'plugin', weight: 10, pluginName: 'we-plugin-form',
    path: 'files/public/we-form.js'
  });

  return plugin;
};
