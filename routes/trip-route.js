const router = require('express').Router();
const multer = require('multer');
const Trip = require('../models/trip-model');
const sharp = require('sharp');
const fs = require('fs');

const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') //저장 위치
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
  }
})
const upload = multer({ storage: _storage });
const authCheck = (req, res, next) => {
    if(!req.user) {
        //if user is not logged in
        res.redirect('/auth/login');
    } else {
        //if logged in
        next();
    }
};

router.get('/list', (req, res) => {
    Trip.find({}).sort({ "createdTime": -1 }).limit(10)
    .then(trips => {
            res.json({trips})
        }
    )
});

router.post('/list/more', (req, res) => {
    let page = req.body.page;
    Trip.find({}).sort({ "createdTime": -1 }).skip(page * 10).limit(10)
    .then(trips => {
            res.json({trips})
        }
    )
});

router.get('/upload', authCheck, (req, res) => {
    res.redirect('http://localhost:8080/write?googleid=' + req.user.googleId + '&username=' + req.user.username);
});

router.post('/upload', upload.single('userfile'), function(req, res){
    sharp(req.file.path).resize(500, 500).toFile(req.file.filename, function (err,info) {
        if (err) return next(err)
        fs.rename(req.file.filename, './uploads/' + req.file.filename, function(){
            new Trip({
                googleid: req.body.googleid,
                username: req.body.username,
                idea: req.body.idea,
                location: req.body.location,
                filename: req.file.filename
            }).save().then((trip) => {
                res.json({'message' : 'success', 'trip': trip});
            }).catch((err) => {
                res.json({'message' : err});
            });
        });
       
    })
});

module.exports = router;