// Import the express module
const express = require('express');
var http = require("http");
var url = require("url");
// Define a router (a part of the express module)
const router = express.Router();
var mysql = require('mysql'); //MySQL connection info
var config = require('../../Data_Files/config.js');
var con = mysql.createConnection(config.databaseOptions);
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
require('env');

/**
 * Full CRUD below (Create, Read, Update, Delete)
 */



// POST (CREATE): http://localhost:3000/api/register
router.post('/', (req, res) => {
    var email = req.body.userEmail; 
    var hash = req.body.userPass;
    var billTo = req.body.userBillTo;
    var phone = req.body.userPhone;
    var contName = req.body.userContName;
    var salt = crypto.randomBytes(16).toString('hex');
    console.log("Salt: "+salt);
    hash = crypto.pbkdf2Sync(hash, salt, 1000, 64, 'sha256').toString('hex');

    console.log("Server Side: "+email);
    console.log("Server Side: "+billTo);
    console.log("Server Side: "+phone);
    console.log("Server Side: "+contName);

    console.log("Hash: "+hash);



    con.connect(function(erro) {  //MySQL connection
      

            var sql = "SELECT * FROM users WHERE email='"+email+"';";

            con.query(sql,  function(erro, result) {
                if (erro) {
                    console.log("Inside Error 1");


                } 
                else {

                    //if you find email from query
                    if (result.length > 0) {
                        if (result) {
                            console.log("Email already in use");
                        }        
                    }

                    else if(!email.includes('@') || !email.includes('.')){

                        console.log("Not a valid email");



                    }

                    else if(req.body.userPass.toLowerCase() == req.body.userPass){
                        console.log("One capital letter required");
                    }

                    else if(req.body.userPass != req.body.userConf){

                        console.log("passwords do not match");

                    }

                    else if(!billTo){
                        console.log("Bill to Required");

                    }
                    
                    else if(!phone){
                        console.log("Phone number Required");

                    }
                    else if(!contName){
                        console.log("Contact Name Required");

                    }


                    //if you do not find email from query
                    else{

                        
                        if(email.length>1){

                            console.log("Super Secret Hash");
                            insert = "INSERT INTO users (email , hash, billTo, phone, contName, salt) VALUES ( ? , ? , ? , ? , ?, ?  );";
                        
                            con.query(insert, [email,hash,billTo,phone,contName,salt], function(erro, resultTwo){
                                if(erro){

                                    console.log(erro);
                                    console.log("Inside Error 2");

                                }
                                else{

                                
                                    var userData =  "SELECT * FROM users WHERE email='"+email+"';";

                                    con.query(userData, function(erro, info){

                                        if(erro){
                                            console.log("didnt work");
                                        }
                                        else{
                                            // set expiration to 60 days
                                            var today = new Date();
                                            var exp = new Date(today);
                                            exp.setDate(today.getDate() + 60);

                                            var token = jwt.sign({
                                                id: info[0].id,
                                                userEmail: email,
                                                billTo: info[0].billTo,
                                                phone: info[0].phone,
                                                contName: info[0].contName,
                                                admin: info[0].admin,
                                                exp: parseInt(exp.getTime() / 1000),
                                            }, process.env.TOKEN);


			                                res.json({token: token});

                                        }
                                    })
                                }
                            })
                    
                        }
                        
                    }
                }
            });        
        });

});





// Export the defined router (routes) back to the App
module.exports = router;