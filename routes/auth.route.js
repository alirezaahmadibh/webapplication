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


// Login page
router.get('/login', (req, res) => {
    res.render('login', {
        errorMessage: null
    });
});


// Register page
router.get('/register', (req, res) => {
    res.render('register', {
        errorMessage: null
    });
});


// Forget password page
router.get('/forget-password', (req, res) => {
    res.render('forget-password');
});


// Reset password page
router.get('/forget-password/:token', async (req, res) => {
    res.render('password-change', { token: req.params.token });
});


// LOGIN
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

    const token = jwt.sign(
        {
            id: user.id,   // ✔️ اصلاح شد
            email: user.email
        },
        secretkey,
        {
            expiresIn: '1h'
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        path: '/'
    });

    return res.redirect('/user/profile');
});


// REGISTER
router.post('/register', async (req, res) => {

    const { username, firstName, lastName, email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        return res.render('register', {
            errorMessage: "User already exists!"
        });
    }

    await User.create({
        username,   // ✔️ اضافه شد
        firstName,
        lastName,
        email,
        password
    });

    res.redirect('/auth/login');
});


// RESET PASSWORD
router.post('/forget-password/:token', async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const resetPassword = await ResetPassword.findOne({
        where: { token }
    });

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