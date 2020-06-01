const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');
const Sequelize = require('sequelize');


router.get("/register", checkAuthenticated, (req, res) => {
    res.render("register.ejs");
});

router.get("/login", checkAuthenticated, (req, res) => {
    console.log(req.session.flash.error);
    res.render("login.ejs");
});

router.get("/dashboard", checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    res.render("dashboard", { user: req.user.name });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.render("index", { message: "You have logged out successfully" });
});

router.post("/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    console.log({name, email, password, password2});
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    } else {
        hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
            .then(user => res.redirect('/'))
            .catch(err => console.log(err))
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}


module.exports = router;