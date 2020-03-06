const express = require('express');
const router = express.Router();

router.get('/', function(req, res){

   var mysql = require('mysql'); //MySQL connection info
    var config = require('../../Data_Files/config.js');
    var con = mysql.createConnection(config.databaseOptions);
    var quantity = 1;

    con.connect(function(erro) {  //MySQL connection
        if (erro) {
            res.send({erro})

        } else {
          console.log(req.query.item)
          var sql = "SELECT * from lamps WHERE item=?;";
          console.log(sql);
          con.query(sql,  [req.query.item], function(erro, specData) {
                if (erro) {
                    res.send({erro})

                } 
                else {
               
                  if(specData[0].uniID == ''){

                    specData[0].uniID = "No ID Found";

                  }



                  specData[0].price = (specData[0].price).toFixed(2);

                   specData = {
                    "item" : specData[0].item,
                    "des" : specData[0].des,
                    "price" : specData[0].price,
                    "totalPrice" : (specData[0].price * quantity).toFixed(2),
                    "image" : specData[0].image,
                    "mpn" : specData[0].mpn,
                    "id" : specData[0].uniID,
                    "type" : specData[0].type
                  }

                  console.log(specData);
              
                  
                    res.render('search', {specData});

                }
            });
        }
    });


 /* var data = {

      "item" : req.query.item,
      "des" : req.query.des,
      "price" : req.query.price,
      "image" : req.query.image


  }*/

});


module.exports = router;

