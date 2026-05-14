const express = require('express');
const router = express.Router();
const secretkey = 'your_secret_key';  
const User = require('../models/user.model');
const ResetPassword = require('../models/reset-password-model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Mailgun = require('mailgun-js');



function generateResetToken() {
    return new Promise((resolve, reject) => {   
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const token = buffer.toString('hex');
                resolve(token);
            }
        });
    });
}


// ./views/login.ejs
router.get('/login', (req, res) => {

    res.render('login', {
        errorMessage: null
    });

});


// ./views/register.ejs
router.get('/register', (req, res) => {

    res.render('register', {
        errorMessage: null
    });

});



router.get('/forget-password', (req, res) => {

    res.render('forget-password');

});

router.get('/forget-password/:token', async (req, res) => {
    res.render('password-change', { token: req.params.token });
});


// Login
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    // Secret key
    const secretkey = 'your_secret_key';

    // Find user
    const user = await User.findOne({
        where: { email }
    });

    // User not found
    if (!user) {

        return res.render('login', {
            errorMessage: "User not found!"
        });

    }

    // Wrong password
    if (user.password !== password) {

        return res.render('login', {
            errorMessage: "The password is incorrect!"
        });

    }

    // Create JWT token
    const token = jwt.sign(

        {
            "id": user._id,
            "email": user.email
        },

        secretkey,

        {
            expiresIn: '1h'
        }

    );

    // Create cookie
    res.cookie('token', token, {

        httpOnly: true,

        maxAge: 60 * 60 * 1000, // 1 hour
        path:'/'

    });

    // Redirect to profile
    return res.redirect('/user/profile');

});


// Register user
router.post('/register', async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    // User exists
    if (user) {

        return res.render('register', {
            errorMessage: "User already exists!"
        });

    }

    // Create user
    await User.create({
        firstName,
        lastName,
        email,
        password
    });

    return res.send("User created successfully!");

});


router.post('/forget-password:token', async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const resetPassword = await ResetPassword.findOne({
        where: { token }
    });

    // User found
    if (resetPassword) {
        const user = await User.findOne({
            where: { email: resetPassword.email }
        });

        if (user) {
            user.password = password;
            await user.save();
            res.redirect('/auth/login');
        } else {
            res.redirect('/auth/login');    
        }
    } else {
        res.redirect('/auth/login');
    }   
}); 

module.exports = router;