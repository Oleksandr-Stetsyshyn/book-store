const express = require('express')
// const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/User');
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

function initialize(passport) {
    console.log("Initialized");
    const authenticateUser = (email, password, done) => {
        console.log(email, password);
        User.findOne({ where: { email: email } })
            .then(res => {
                console.log(res);
                if (res != null) {
                    const user = res.dataValues;
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            //password is incorrect
                            return done(null, false, { message: "Password is incorrect" });
                        }
                    });
                } else {
                    // No user
                    return done(null, false, {
                        message: "No user with that email address"
                    });
                }
            })
            .catch(err => console.log(err));
    };

    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            // .then(res=>{console.log(res.dataValues)})
            .then(res => {
                console.log(`ID is ${res.dataValues.id}`);
                return done(null, res.dataValues);
            })
            .catch(err => console.log(err));
    });
}

module.exports = initialize;