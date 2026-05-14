const express = require('express');
const sequelize = require('./database/sequelize-connect');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const path = require('path');
const cookieParser = require('cookie-parser');
const User = require('./models/user.model');
const homeRoutes = require('./routes/home.route');

const app = express();
const port = 3000;
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', homeRoutes);



// Start server
app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({force: true});
        console.log('Connection has been established successfully.');
        console.log(`Example app listening on port ${port}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});