const http = require('http'),  
      https = require('https'),
      express = require('express');
const authRoutes = require('./routes/auth-route');
const tripRoutes = require('./routes/trip-route');
const mongoose = require('mongoose');

const passportSetup = require('./config/passport-setup');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

// connect to mongodb 
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
    console.log('connected to mongodb');
});

// let multer = require('multer');
// let _storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') //저장 위치
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
//   }
// })

// let upload = multer({ storage: _storage });
const fs = require('fs');
const cors = require('cors');

const options = {  
    key: fs.readFileSync('key/private.pem'),
    cert: fs.readFileSync('key/public.pem')
};

const port1 = 3000;  
const port2 = 9000;
  
//app.use('/user', express.static('uploads'));
app.set('views', './views_file');
app.set('view engine', 'jade');
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/trip', tripRoutes);

http.createServer(app).listen(port1, function(){  
    console.log("Http server listening on port " + port1);
});

https.createServer(options, app).listen(port2, function(){  
    console.log("Https server listening on port " + port2);
});


// app.get('/upload', function(req, res){
//     res.render('upload');
// });

// app.post('/upload', upload.single('userfile'), function(req, res){
//     console.log(req.file);
//     console.log(req.body);
//     let sql = 'INSERT INTO Desks(filename, idea, location) VALUES(?,?,?)';
//     let params = [req.file.filename, req.body.idea, req.body.location];    
//     conn.query(sql, params, function(err, rows, fields){
//         if(err){
//             res.json({ success: false });
//         }
//         else {
//             console.log('UPLOAD SUCCESS!', req.file);
//             res.json({ success: true, file: req.file });
//         }
//     })
// });
