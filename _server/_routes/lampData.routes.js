var express = require('express');
const router = express.Router();

router.get('/', function (req, res){

    var mysql = require('mysql'); //MySQL connection info
    var config = require('../../Data_Files/config.js');
    var con = mysql.createConnection(config.databaseOptions);


    con.connect(function(erro) {  //MySQL connection
        if (erro) {
            res.send({erro})

        } else {

        var sql = "SELECT * from lamps";
        con.query(sql,  function(erro, data) {
                if (erro) {
                    res.send({erro})

                } else {
                    res.send({data});
                }
            });
        }
    });
});


// Export the defined router (routes) back to the App
module.exports = router;
