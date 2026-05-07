const express = require('express')
const router = express.Router()
const User = require('../models/user.model');


//./views/login.ejs
router.get('/login', (req, res) => {
    res.render('login', {
        errorMessage: null
    });
});


//./views/register.ejs
router.get('/register', (req, res) => {
    res.render('register', {
        errorMessage: null
    });
});


// Login
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return res.render('login', {
            errorMessage: "User not found!"
        });
    }

    if (user.password !== password) {
        return res.render('login', {
            errorMessage: "The password is incorrect!"
        });
    }

    return res.send("Hi to panel");
});


// Register user
router.post('/register', async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        return res.render('register', {
            errorMessage: "User already exists!"
        });
    }

    await User.create({
        firstName,
        lastName,
        email,
        password
    });

    return res.send("User created successfully!");
});

module.exports = router