/**
 * Import your routes here in 1 loaded for ease of reading
 */
function load(app) {
    // Imports code that defines route for http://localhost:3000/api/bob
    app.use('/api/bob', require('./bob.routes')); // Note: best practice to name a file what it is ( ex. `something`.routes.js)
    // Imports code that defines route for http://localhost:3000/api/connor
    app.use('/api/connor', require('./connor.routes'));

    app.use('/api/lampBrands', require('./lampBrands.routes'));

    app.use('/api/lampData', require('./lampData.routes'));

    app.use('/api/submit', require('./submit.routes'));

    app.use('/search', require('./search.routes'));

    app.use('/api/login', require('./login.routes'));

    app.use('/api/register', require('./register.routes'));

    app.use('/api/forgot', require('./forgot.routes'));

    app.use('/api/reset', require('./reset.routes'));


}

module.exports = { load };

