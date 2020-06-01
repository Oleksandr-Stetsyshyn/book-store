const express = require('express')
const router = express.Router();
const Book = require('../models/Book');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const passport = require("passport");
const initializePassport = require("../passportConfig");
initializePassport(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get('/', (req, res) =>
    Book.findAll()
        .then(books => { res.render('books', { books }) })
        .catch(err => console.log(err)));




// router.use("/add",
//     passport.authenticate("local", {
//         successRedirect: "/add",
//         failureRedirect: "/users/login",
//         failureFlash: true
//     })
// );

router.get('/add', (req, res) => res.render('add'));
router.post('/add', (req, res) => {
    let { title, author, price, description, year, imgString } = req.body;
    // console.log({ title, author, price, description, year });

    let errors = [];
    if (!title) {
        errors.push({ text: "Будь ласка заповніть поле title" })
    }
    if (!author) {
        errors.push({ text: "Будь ласка заповніть поле author" })
    }
    if (!price) {
        errors.push({ text: "Будь ласка заповніть поле price" })
    }
    if (!description) {
        errors.push({ text: "Будь ласка заповніть поле description" })
    }
    if (!year) {
        errors.push({ text: "Будь ласка заповніть поле year" })
    }
    if (!imgString) {
        errors.push({ text: "Будь ласка додайте картинку" })
    }
    if (errors.length > 0) {
        console.log(errors);
    } else {
        Book.create({
            title: title,
            author: author,
            price: price,
            description: description,
            year: year,
            imgString: imgString
        })
            .then(() => res.redirect('/books'))
            .catch(err => console.log(err))
    }
});

router.get('/bookDetail/:id', function (req, res) {
    Book.findByPk(req.params.id)
        .then(book => {
            console.log(book.dataValues)
            res.render("bookDetail.ejs", {
                book: book.dataValues
            });
        })
        .catch(err => console.log(err));
});



router.get("/delete/:id", function (req, res) {
    console.log(req.params.id);
    Book.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(book => res.redirect('/books'))
        .then((res) => { console.log(res) });
});

router.get('/edit/:id', function (req, res) {
    Book.findByPk(req.params.id)
        .then(book => {
            console.log(book.dataValues)
            res.render("edit.ejs", {
                book: book.dataValues
            });
        })
        .catch(err => console.log(err));
});

router.post('/edit', (req, res) => {
    let { id, title, author, price, description, year, imgString } = req.body;
    let errors = [];
    if (!id) {
        errors.push({ text: "Немає id" })
    }
    if (!title) {
        errors.push({ text: "Будь ласка заповніть поле title" })
    }
    if (!author) {
        errors.push({ text: "Будь ласка заповніть поле author" })
    }
    if (!price) {
        errors.push({ text: "Будь ласка заповніть поле price" })
    }
    if (!description) {
        errors.push({ text: "Будь ласка заповніть поле description" })
    }
    if (!year) {
        errors.push({ text: "Будь ласка заповніть поле year" })
    }
    if (!imgString) {
        errors.push({ text: "Будь ласка додайте картинку" })
    }
    if (errors.length > 0) {
        console.log(errors);
    } else {
        console.log(req.body);

        Book.update({
            title: title,
            author: author,
            price: price,
            description: description,
            year: year,
            imgString: imgString
        }, {
            where: {
                id: req.body.id
            }
        })
            .then(() => res.redirect('/books'))
            .catch(err => console.log(err))
    }
});

router.get('/search', (req, res) => {
    console.log(req.query);
    console.log(req.query.key);
    let { filterBy, key } = req.query;
    Book.findAll({ where: { [filterBy]: { [Op.iLike]: '%' + key + '%' } } })
        .then(books => res.render('books', { books }))
        .catch(err => console.log(err));
});

router.get('/sort', (req, res) => {
    console.log(req.query);
    console.log(req.query.sortBy);
    let { sortBy } = req.query;
    Book.findAll({
        order: [
            [sortBy, 'ASC'],
        ],
    })
        .then(books => res.render('books', { books }))
        .catch(err => console.log(err));
});

module.exports = router;