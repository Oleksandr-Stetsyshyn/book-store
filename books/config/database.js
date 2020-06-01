const { Sequelize } = require('sequelize');
module.exports = new Sequelize('books', 'postgres', '5042450424Qq', {
  host: 'localhost',
  dialect: 'postgres'
});