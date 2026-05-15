const express = require('express');
const router = express.Router();

const User = require('../models/user.model');

const { requireAuth } = require('../middlewares/auth.middleware');


// Profile
router.get('/profile', requireAuth, async (req, res) => {
    console.log(res.locals.decoded);
    try {

        // Find user
        const user = await User.findOne({

            where: {
                email: res.locals.decoded.email
            }

        });

        // User found
        if (user) {

            return res.render('profile', {

                user: user

            });

        } else {

            return res.redirect('/auth/login');

        }

    } catch (error) {

        console.log(error);

        return res.redirect('/auth/login');

    }

});


module.exports = router;