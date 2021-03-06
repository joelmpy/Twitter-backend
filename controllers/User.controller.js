const express = require("express");
const router = express.Router();
const UsersModel = require('../models/user.model');
const expressValidator = require("express-validator");
const passport = require('../config/passport');
const bcrypt = require("bcrypt");

const multer = require("multer");
const upload = multer({ dest:'public/uploads/' }); // cette ligne va créer le dossier /public/uploads s'il n'existe pas

router.get('/', function (req, res) {
    res.send("users");
});

router.get('/:id', async function(req, res, next) {
    console.log(req.params);
    req.params;
    const id = req.params.id;
    UsersModel.findById(id).exec().then(user=> {
        res.json(user)
    })
})

router.post('/register',

    expressValidator.body("password").isLength({ min: 8 }),

    async (req, res, next) => {
        const errors = expressValidator.validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {

            const body = req.body
            console.log(body);

            const hash = await bcrypt.hash(body.password, 5);
            
            const newUser = new UsersModel({
                ...body,
                password: hash
            })

            newUser.save().then(user => {
                res.json(user)
            });
        }
    }
)

router.post('/login', passport.authenticate('local'), function(req, res, next){
    if (!req.user) {
        res.status(401).send('The username password is incorrect')
    }
    res.status(200).json({message: 'ok'})
})

module.exports = router