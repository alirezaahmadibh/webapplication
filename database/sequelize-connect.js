const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'test', '1',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;