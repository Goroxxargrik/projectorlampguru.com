// Import the express module
const express = require('express');
// Define a router (a part of the express module)
const router = express.Router();
var mysql = require('mysql'); //MySQL connection info
var config = require('../../Data_Files/config.js');
var con = mysql.createConnection(config.databaseOptions);
/**
 * Full CRUD below (Create, Read, Update, Delete)
 */



// POST (CREATE): http://localhost:3000/api/submit
router.post('/', (req, res) => {
    var bName = req.body.brand; 
    var lName = req.body.lamp;
    console.log(bName);
    console.log(lName);

    if(bName == "All lamps" && lName.length > 2)
    {
        
         
            con.connect(function(erro) {  //MySQL connection
      

                var sql = "SELECT * from lamps WHERE brand='"+lName+"' || webDes LIKE '%"+lName+"%'  || mpn LIKE '%"+lName+"%' ;";
    
                con.query(sql,  function(erro, data) {
                    if (erro) {
                        console.log("Inside Error");
    
    
                    } else {
                        res.json(data)
                        console.log("Good (I think)");
    
                    }
                });
            
            });

        
        
    }
 
    else{
        con.connect(function(erro) {  //MySQL connection
      

            var sql = "SELECT * from lamps WHERE brand='"+bName+"' && (webDes LIKE '%"+lName+"%' || mpn LIKE '%"+lName+"%') ;";

            con.query(sql,  function(erro, data) {
                if (erro) {
                    console.log("Inside Error");


                } else {
                    res.json(data)
                    console.log("Good (I think)");

                }
            });
        
    });

    }
    

});



 // GET (READ): http://localhost:3000/api/submit
 router.get('/', (req, res) => { 
    res.send( req.body.brand);
    res.send( req.body.lamp);

});
    




// Export the defined router (routes) back to the App
module.exports = router;