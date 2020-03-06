/*
@summary

JavaScirpt program to take a CSV file with Lamp information and insert
it into a MySQL table.

Average execution time: 8.5 minutes

@description

After successfully connecting to the guru database, the data in the 'lamps'
table will be truncated. Since the client will be uploading a complete set of
data anyway, this process will simulate an update process.

Once the data is truncated, each row of the uploaded CSV file will be turned
into JSON data, until each row is convrted. Then the JSON iterated through.

Each JSON entities values will be saved as variables (jBrand, jWebDesc, etc).
These values will be used in the insert query for our lamps table.

Once completed, each row should be mimicked and should look almost identical to
the CSV file that was uploaded.

This data will be used for the projectorlampguru page.


@since   12.10.19
@alias   Connor Enterline



*/


//Used to test amount of time to complete scirpt
var start = new Date().getTime();

//required imports for functions
const mysql = require('mysql');
const csv = require('csv-parser');
const fs = require('fs');
const { exec } = require("child_process");
var config = require('./Data_Files/config.js');

//establishes connection to guru database
var con = mysql.createConnection(config.databaseOptions);

//start from scratch every upload to simulate file editing
var sql = mysql.format("TRUNCATE lamps");

//throws error if connection to database fails. If successful, truncates lamps
con.query(sql, function (err, result) {
  if (err) throw err;

});


/*

@param {Number}   i - used to count how many items will be uploaded
@param {Number}   load - used to analyze how close file is to being uploaded (prints done when 'load' equals 'i')
@param {String}   j___ - jBrand, jItem, etc. Used to store JSON data for insert query
@param {JSON}     data - JSON conglomeration of all data in the uploaded file
@param {File}     lampData.csv - uploaded file

*/
var i = 0;
var load = 1;
var data = fs.createReadStream('./_client/public/uploads/lampData.csv')
  .pipe(csv())
  //iterates through data, loops each entity (row)
  .on('data', (row) => {

  //stores each JSON value as a var
  var jBrand = row['Brand'];
  var jItem = row['Item'];
  var jDesc = row['Description'];
  var jMPN = row['MPN'];
  var jCustomerPrice = row['CustomerPrice'];
  var jWebDesc = row['WebDescription'];
  var jID = row['UniqueID'];
  var jType = row['LampType'];
  var jImage = row['Image'];


  //runs mysql insert command with each var
  var sql = mysql.format("INSERT INTO lamps (brand, item, des, mpn, price, webDes, uniID, type, image) VALUES (?,?,?,?,?,?,?,?,?)", [jBrand,jItem,jDesc,jMPN,jCustomerPrice,jWebDesc,jID,jType,jImage]);


  i++;

  //throws error if MySQL command fails
  con.query(sql, function (err, result) {
    if (err) throw err;

    //checks if upload is complete
    if(load == i)
    {
      //Relatively self explanatory
      console.log("\nDone!");

      //gets end time in milliseconds
      var end = new Date().getTime();
      var time = end - start;

      //spits out time it takes to complete the script in milliseconds
      console.log('\nExecution time: ' + time +" Milliseconds");

    }
    load++;
  });
  })
  .on('end', () => {

    //indicates that upload has initilized
    console.log("\n"+i+" being processed...\n");


  });
