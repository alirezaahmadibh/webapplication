const express = require('express');
const router = express.Router();

const User = require('../models/user.model');

const jwt = require('jsonwebtoken');


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
            id: user.id,
            email: user.email
        },

        secretkey,

        {
            expiresIn: '1h'
        }

    );

    // Create cookie
    res.cookie('token', token, {

        httpOnly: true,

        maxAge: 60 * 60 * 1000 // 1 hour

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


module.exports = router;