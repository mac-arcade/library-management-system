/* This is a route handler for managing books */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import book title/details data
const { books } = require("../data/books.json");

// import physical book copy data
const { bookCopies } = require("../data/bookCopies.json");

// import book issue transaction data
const { issuedBooks } = require("../data/issuedBooks.json");

// import users data
const { users } = require("../data/users.json");

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

    // send success message
    res.status(201).json({
        success: true,
        message: "new book added successfully",
        data: book
    });
});


/**
 * Route: /books/issued
 * Method: GET
 * Description: Get all physical book copies that are currently issued
 * Access: Public
 * Parametera: none
 */
router.get("/issued", (req, res) => {

    // filter the book copies and keep only those whose status is "issued"
    const issued = bookCopies.filter(
        (each) => each.status === "issued"
    );

    // if there are no currently issued book copies
    if (issued.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No issued books"
        });
    }

    // return all currently issued book copies
    res.status(200).json({
        success: true,
        data: issued
    });
});

/**
 * Route: /books/issued/withfine
 * Method: GET
 * Description: Get all issued books that currently have a fine, along with the fine amount, book and user details.
 * Access: Public
 * Parametera: none
 */
router.get("/issued/withfine", (req, res) => {

    // filter issue records and keep only those with a fine greater than 0
    const finedCopies = issuedBooks.filter(
        (each) => Number(each.fine) > 0
    );

    // if no book has a pending fine
    if (finedCopies.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No book with due fine"
        });
    }

    // combine each fined issue record with its related book and user details
    const result = finedCopies.map((issue) => {

        // find the physical book copy using the copyId stored in the issue record
        const copy = bookCopies.find(
            (copy) => copy.id === issue.copyId
        );

        // find the actual book details using the bookId from the physical copy
        const book = books.find(
            (book) => book.id === copy.bookId
        );

        // get only the title from the matched book
        const bookTitle = book.title;

        // find the user who issued the book using userId from the issue record
        const user = users.find(
            (user) => user.id === issue.userId
        );

        // combine user's first and surname
        const userName = user.name + " " + user.surname;

        // return a new object containing the original issue details
        // along with the book title and user name
        return {
            ...issue,
            bookTitle,
            userName
        };
    });

    // return all fined issue records with related book and user information
    res.status(200).json({
        success: true,
        data: result
    });
});


/**
 * Route: /books/:id
 * Method: GET
 * Description: get a book by its ID
 * Access: Public
 * Parametera: id
 */
router.get("/:id", (req, res) => {

    // get id from req parameter
    const id = Number(req.params.id);

    // get book with id passed in parameter
    const book = books.find((book) => book.id === id);

    // book not found
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `book with id: ${id} is not present in database`
        });
    }

    // book is present in database
    res.status(200).json({
        success: true,
        data: book
    });

});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating a book by their ID
 * Access: Public
 * Parametera: id
 */
router.put("/:id", (req, res) => {

    // get id from req parameter
    const id = Number(req.params.id);

    // get index of book with id passed in parameter
    const index = books.findIndex((book) => book.id === id);

    // book not found
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `book with id: ${id} is not present in database`
        });
    }

    /* if book is present in database, update the book with new data */

    // get the book detail to update from request body
    const data = req.body;

    // update the book with new data
    books[index] = {
        ...books[index], ...data
    }

    //send success status
    res.status(200).json({
        success: true,
        message: "book updated successfully",
        data: books[index]
    });
})

/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book using their ID
 * Access: Public
 * Parametera: id
 */
router.delete("/:id", (req, res) => {

    // get id from req parameter
    const id = Number(req.params.id);

    // get index of book with id passed in parameter
    const index = books.findIndex((book) => book.id === id)

    // book is not found
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `book with id ${id} is not found`
        });
    }

    // book is found, delete / splice from books
    books.splice(index, 1);

    // send success message
    res.status(200).json({
        success: true,
        message: `book with id: ${id} deleted successfully`
    });

});

module.exports = router;