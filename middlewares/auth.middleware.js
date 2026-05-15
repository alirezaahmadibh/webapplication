const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

    const secretkey = 'your_secret_key';

    const { token } = req.cookies;

    // No token
    if (!token) {

        return res.redirect('/auth/login');

    }

    try {

        // Verify token
        const decoded = jwt.verify(token, secretkey);

        console.log(decoded);

        // Save decoded data
        res.locals.decoded = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.redirect('/auth/login');

    }

};

module.exports = {
    requireAuth
};