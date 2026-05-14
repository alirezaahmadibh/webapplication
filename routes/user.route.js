const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


// Profile
router.get('/profile', async (req, res) => {

    const { token } = req.cookies;

    const secretkey = 'your_secret_key';

    // No token
    if (!token) {

        return res.redirect('/auth/login');

    }

    try {

        // Verify token
        const decoded = jwt.verify(token, secretkey);

        // Find user
        const user = await User.findOne({
            where: {
                email: decoded.email
            }
        });

        // User not found
        if (!user) {

            return res.redirect('/auth/login');

        }

        // Render profile page
        return res.render('profile', {

            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }

        });

    } catch (error) {

        console.log(error);

        return res.redirect('/auth/login');

    }

});


module.exports = router;