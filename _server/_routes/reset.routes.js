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


router.post('/', (req, res) => {
    var token = req.body.token;
    var hash = req.body.hash;
    var confHash = req.body.confHash;

    sql = "SELECT * FROM reset WHERE token = ?;";

    con.query(sql, [token], function (erro, result) {

        if (erro) {
            console.log("big error");
        }
        else {

            console.log(result.length);

            if(!result.length > 0){
                console.log("Token Doesnt Exist");
                res.json({message : "no_salt"});
            }
            else{

            
            sqlTwo = "SELECT * FROM users WHERE salt = ?;";

            con.query(sqlTwo, [result[0].salt], function (erro, resultTwo) {


                if (erro) {
                    console.log("error");
                }
                else {

                    if(hash.toLowerCase() == hash){
                        console.log("passwords must have at least 1 capital letter");
                        res.json({message : "no_cap"});
                    }
                    else{

                    

                    hash = crypto.pbkdf2Sync(hash, result[0].salt, 1000, 64, 'sha256').toString('hex');
                    confHash = crypto.pbkdf2Sync(confHash, result[0].salt, 1000, 64, 'sha256').toString('hex');

                    console.log(hash);
                    console.log(confHash);

                    if (hash != confHash) {
                        console.log("passwords don't match");
                        res.json({message : "no_match"});

                    }

                    else {
                        
                        var update = "UPDATE users SET hash = ?";
                        con.query(update, [hash], function (erro, updateRes) {

                            if(erro){
                                console.log("very little error");
                            }
                            else{

                                var remove = "DELETE FROM reset WHERE email = ?;"
                                con.query(remove, [result[0].email], function (erro, removeRes) {
                                    if(erro){
                                        console.log("smallest error");

                                    }
                                    else{
                                        console.log("Shoulda Worked");
                                        res.json({ status : "successful"});

                                    }
                                });


                            }
                        });


                    }

                }
            }

            });
        }
    }


    });




});





// Export the defined router (routes) back to the App
module.exports = router;