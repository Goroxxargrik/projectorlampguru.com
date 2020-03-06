// Import the express module
const express = require('express');
// Define a router (a part of the express module)
const router = express.Router();

/**
 * Full CRUD below (Create, Read, Update, Delete)
 */

// GET (READ): http://localhost:3000/api/bob
router.get('/', (req, res) => { // The router takes request (req) params and callsback "response" (res)
    res.send('This is Bob\'s get route'); // This route responds with text
});

// POST (CREATE): http://localhost:3000/api/bob
router.post('/', (req, res) => {
    var bob = req.body.name; // This sets a variable bob equal to the input variable "name" that is being posted to http://localhost:3000/api/bob
    res.json({ myName: bob }); // Responds with json of whatever was posted in the name variable 
});

// PUT (UPDATE): http://localhost:3000/api/bob
router.put('/', (req, res) => {
    var oldName = req.body.name;
    var newName = 'Juggy Gails';
    res.json({ oldName: oldName, newName: newName }); // Responds with the old name and newName for update
});

// DELETE (DELETE): http://localhost:3000/api/bob
router.delete('/', (req, res) => {
    res.send('This is where something would be deleted');
});



// Export the defined router (routes) back to the App
module.exports = router;