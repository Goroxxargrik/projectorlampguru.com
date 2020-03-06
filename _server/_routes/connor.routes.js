







// Import the express module
const express = require('express');
// Define a router (a part of the express module)
const router = express.Router();

const path = require('path'),
multer = require('multer');

let storage = multer.diskStorage({
    destination: './_client/public/uploads/',

    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(path.extname(file.originalname), "") + path.extname(file.originalname))
    }
})

let upload = multer({ storage: storage })

router.use(express.static(path.join(__dirname, 'public')));


router.post('/uploads/', upload.single('file'), function(req,res,next){
    console.log('File Uploaded Successfully! ', req.file.filename);
    res.send({"statusCode":200,"statusMessage":"file uploaded successfully!"});
    require('../../dbase.js');
});


router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});


// GET (READ): http://localhost:3000/api/connor
router.get('/', (req, res) => { // The router takes request (req) params and callsback "response" (res)
    res.send('This is Connor\'s get route'); // This route responds with text
});

// Export the defined router (routes) back to the App
module.exports = router;
