// Import the express module
const express = require('express');
// Define a router (a part of the express module)
const router = express.Router();
var mysql = require('mysql'); //MySQL connection info
var config = require('../../Data_Files/config.js');
var con = mysql.createConnection(config.databaseOptions);
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');



/**
 * Full CRUD below (Create, Read, Update, Delete)
 */



// POST (CREATE): http://localhost:3000/api/login
router.post('/', (req, res) => {
    var hash = "";
    var salt = "";
    var email = req.body.userEmail; 
    var sql = "SELECT * FROM users WHERE email=?;";
    console.log(process.env.TOKEN);
    con.query(sql,  [email] , function(erro, result) {
        if (erro) {
            console.log("Big Error");


        }

        else if(!result.length > 0){

            
            console.log("email doesnt exist");

        }

        else{

     
            let r = Math.random().toString(36).substring(2);
            token = r.toUpperCase();

            var insert = "INSERT INTO reset (email , token, salt) VALUES ( ? , ? , ?  );";

            con.query(insert,  [result[0].email, token, result[0].salt] , function(erro, resultTwo) {
                if(erro){
                    console.log("little Error");
                    console.log("=========================");
                    console.log(erro);
                }
                else{
                    var text = "text thing";
                    var html = '<h1><u>'+token+'</u></h1>';
                    html+= '<p>Use the above token to to reset your password</p>';

                    var options = {
                        from: config.smtp.from,
                        to: email,
                        subject: 'Password Reset',
                        text: text,
                        html: html
                    };
                    let transporter = nodemailer.createTransport({
                        host: config.smtp.server,
                        port: config.smtp.port,
                        secure: config.smtp.secure,
                        auth: {
                            user: config.smtp.user,
                            pass: config.smtp.password
                        }
                    });

                    transporter.sendMail(options, (err, info) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                message: 'Something went wrong.  Your request could not be sent.'
                            });
                        } 
                        else {
                            return res.json({message: info.response});
                        }
                    });
    
                }
     
            });
        }
        
    });
            
});

// Export the defined router (routes) back to the App
module.exports = router;