/**
 * Model action create btn
 *
 * {{we-action-create-btn modelName [params...] req}}
 *
 */

module.exports = function(we) {
  const _ = we.utils._;

  return function renderWidget(modelName, req) {
    const roles = _.clone(req.userRoleNames);
    const options = arguments[arguments.length-1];

    let redirectTo = options.hash.redirectTo || req.url;

    if (we.acl.canStatic('create_' + modelName, roles)) {
      let params = [];
      for (let i = 2; i < arguments.length-1; i++) {
        params.push(arguments[i]);
      }

      return new we.hbs.SafeString(we.view.renderTemplate('model/create-btn', req.res.locals.theme, {
        url: we.router.urlTo(modelName + '.create', params) + '?redirectTo='+ redirectTo,
        text: req.__('Create')
      }));
    } else {
      return '';
    }
  }
}