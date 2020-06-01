const Sequelize = require('sequelize');
const db = require('../config/database');

const Book = db.define('book', {
title: {
    type: Sequelize.STRING
},
author: {
    type: Sequelize.STRING
},
price: {
    type: Sequelize.STRING
},
description: {
    type: Sequelize.STRING
},
year: {
    type: Sequelize.STRING
},
imgString: {
    type: Sequelize.STRING
}
}, {
    timestamps: false // додати
})

module.exports = Book;