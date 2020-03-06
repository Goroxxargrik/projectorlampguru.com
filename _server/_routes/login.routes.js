// Import the express module
const express = require('express');
// Define a router (a part of the express module)
const router = express.Router();
var mysql = require('mysql'); //MySQL connection info
var config = require('../../Data_Files/config.js');
var con = mysql.createConnection(config.databaseOptions);
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

/**
 * Full CRUD below (Create, Read, Update, Delete)
 */



// POST (CREATE): http://localhost:3000/api/login
router.post('/', (req, res) => {
    var email = req.body.userEmail; 
    var hash = req.body.userPass;

    
    con.connect(function(erro) {  //MySQL connection
      
        
            var sql = "SELECT * FROM users WHERE email=?;";
            console.log(process.env.TOKEN);

            con.query(sql,  [email] , function(erro, result) {
                if (erro) {
                    console.log("Inside Error");


                } 
                else {

                    //if you find email from query
                    if (result.length > 0) {
                        if (result) {


                            hash = crypto.pbkdf2Sync(hash, result[0].salt, 1000, 64, 'sha256').toString('hex');

                                
                            if(hash == result[0].hash){

                                var today = new Date();
			                    var exp = new Date(today);
			                    exp.setDate(today.getDate() + 60);

			                    var token = jwt.sign({
				                    id: result[0].id,
				                    userEmail: email,
                                    billTo: result[0].billTo,
                                    phone: result[0].phone,
                                    contName: result[0].contName,
                                    admin: result[0].admin,
				                    exp: parseInt(exp.getTime() / 1000),
			                        }, process.env.TOKEN);
                                
                                res.json({token: token});
                                

                            }
                            else{
                                res.status(400).send(new Error('I Like to eat graaaass'));

                                console.log("bad password");
                                
                            }

                        }        
                    }

                    //if you do not find email from query
                    else{
                        res.status(403).send(new Error());

                        console.log("Gotta register first dog");

                    }
                }
            });        
        });
    
    
});

// Export the defined router (routes) back to the App
module.exports = router;