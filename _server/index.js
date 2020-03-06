/**
 * Require the necessary packages
 * Same as "import statement" in python
 */
 // Express is like the brains of the operation.  Similar to Flask in Python.
 // Controls the routes.
if(!process.env.TOKEN){
    var env = require ('./env.js');
}

const express = require('express');
// Create a new app using express
const app = express();

// Set a port for your web server/app to run on
const port = 3000;
// Path is a built in Node.js thing that allows you to use the current file path...see below

const path = require('path');
// Morgan is an additional npm package that shows you what your app is doing on the cli when running in dev
const logger = require('morgan');
/**
 * body-parser and cookie-parser are additional npm modules
 * for handling how cookies and things are
 * processed on an incoming web request
 */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Import the config, models, and routes into your project
const config = require('./_config'), models = require('./_models'), routes = require('./_routes');

// Call the load function to load all of your MongoDb or MySQL database models
models.load();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Run the Morgan logger when in development
app.use(logger('dev'));
// The bodyParser and cookParser...This crap is pretty standard.  Just always include it...never ask why
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Use the built-in Node.js Path model (described above) to join the current directory
 * path with ../_client to define the client directory
 */
app.use(express.static(path.join(__dirname, '../_client/public')));

/**
 * Pass the app variable to the load() function defined in ./routes/index.js
 * This loads all the end point routes
 */
routes.load(app);

/**
 * This is the final route path that is defined.
 * If none of the routes above in the routes.load are found and taken,
 * Land on the default route below.  This allows you to define
 * your backend API in the routes above, but a frontend client in the route below.
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../_client/public/slg.html'));
});

/**
 * Start up your app by listening on the port
 * your defined above.  In this case 3000
 * http://localhost:3000
 */
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happend', err);
    }
    console.log(`server is listening on ${port}`);
});
