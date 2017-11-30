/**
 * Render we.js field errors
 *
 * usage: {{{field-helper-error errors}}}
 */

module.exports = function() {
  return function renderHelper(errors) {
    if (!errors) return '';

    let html = '';
    for (let i = 0; i < errors.length; i++) {
      html += '<span class="help-block">'+errors[i].message+ '</span>'
    }

    return html;
  };
};