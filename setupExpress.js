// EXPRESS AND OTHER SETUP
const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

function setupExpressApp(app) {
    app.set('view engine', 'hbs')
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: false }))

    // setup the session
    app.use(cookieParser(process.env.COOKIE_SECRET))
    app.use(session({
        'cookie': {
            maxAge: 60000
        }
    }))
    app.use(flash())

    // register a middleware for the flash message
    app.use(function (req, res, next) {
        res.locals.success_messages = req.flash('success_messages');
        res.locals.error_messages = req.flash('error_messages');
        next();
    })
}

module.exports = { setupExpressApp };