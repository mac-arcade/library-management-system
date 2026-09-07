/* This is a route handler for managing books */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import books data
const { books } = require("../data/books.json");

/**
 * Route: /books
 * Method: GET
 * Description:  get all the books in the system
 * Access: Public
 * Parametera: none
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    });
});

/**
 * Route: /books
 * Method: POST
 * Description: add a new book to the system
 * Access: Public
 * Parametera: none
 */
router.post("/", (req, res) => {

    // deconstruct the book details from request body
    const { title, author, genre, price, publisher } = req.body;

    // if book details missing
    switch (true) {
        case !title:

            return res.status(400).json({
                success: false,
                message: "please enter title of the book"
            });

        case !author:

            return res.status(400).json({
                success: false,
                message: "please enter author of the book"
            });

        case !genre:

            return res.status(400).json({
                success: false,
                message: "please enter genre of the book"
            });

        case !price:

            return res.status(400).json({
                success: false,
                message: "please enter price of the book"
            });

        case !publisher:

            return res.status(400).json({
                success: false,
                message: "please enter publisher of the book"
            });

        default:
            break;
    }

    /* create a new book */

    // find max id in book and create a new id     
    const id = (books.reduce((max, book) => book.id > max ? book.id : max, 0) + 1);

    // create a book to push in books with info entered
    const book = { id, title, author, genre, price, publisher };

    // push new book in books 
    books.push(book);

    res.status(201).json({
        success: true,
        message: "new book added successfully",
        data: book
    });

    // if (!title || !author || !genre || !price || !publisher) {
    //     res.status(400).json({
    //         success: false,
    //         message: "please enter all required data"
    //     })
    // }
});

module.exports = router;