const hbs = require('hbs');
const wax = require('wax-on');

function setupHBS() {
    // setup template inheritance
    wax.on(hbs.handlebars);
    wax.setLayoutPath('./views/layouts')

    // Handlebar Helpers
    const helpers = require("handlebars-helpers")({
        handlebars: hbs.handlebars,
    });
}

module.exports = { setupHBS }