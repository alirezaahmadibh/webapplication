const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


router.get('/', async (req, res) => {

    let users = await User.findAll();

    const search = req.query.search || '';

    // Search users
    if (search) {

        users = users.filter(user =>

            user.firstName.toLowerCase().includes(search.toLowerCase()) ||

            user.lastName.toLowerCase().includes(search.toLowerCase()) ||

            user.email.toLowerCase().includes(search.toLowerCase())

        );

    }

    // Render page
    res.render('home', {

        users: users,

        search: search

    });

});


module.exports = router;