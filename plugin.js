/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/extend.plugin
 */
var form = require('./lib');

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

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
