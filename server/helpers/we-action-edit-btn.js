/**
 * Model action edit btn
 *
 * {{we-action-edit-btn modelName record [params...] req}}
 *
 */
let _ = require('lodash');

module.exports = function(we) {
  return function renderWidget(modelName, record, req) {
    if (!record) return '';

    let roles = _.clone(req.userRoleNames);
    let options = arguments[arguments.length-1];

    // if is authenticated, check if are owner
    if (req.isAuthenticated()) {
      if (record.isOwner(req.user.id)) {
        // add owner
        if (roles.indexOf('owner') == -1 ) roles.push('owner');
      } else {
        // remove owner if dont are owner
        if (roles.indexOf('owner') > -1 ) roles.splice( roles.indexOf('owner'));
      }
    }


    if (we.acl.canStatic('update_' + modelName, roles)) {
      let params = [];
      for (let i = 3; i < arguments.length-1; i++) {
        params.push(arguments[i]);
      }

      let redirectTo = options.hash.redirectTo || req.url;

      return new we.hbs.SafeString(we.view.renderTemplate('model/edit-btn', req.res.locals.theme, {
        url: we.router.urlTo(modelName + '.edit', params)+ '?redirectTo='+ redirectTo,
        text: req.__('Edit')
      }));
    } else {
      return '';
    }
  }
}