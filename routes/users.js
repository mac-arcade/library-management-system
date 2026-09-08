/* This is a route handler for managing users */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import users data
const { users } = require("../data/users.json");

// import book issue transaction data
const { issuedBooks } = require("../data/issuedBooks.json");
const { use } = require("react");

/**
 * Route: /users
 * Method: GET
 * Description: get all the list of users in the system
 * Access: Public
 * Parametera: none
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});

/**
 * Route: /users
 * Method: POST
 * Description: register a new user
 * Access: Public
 * Parametera: none
 */
router.post("/", (req, res) => {
    /* req.body should have the following fields */
    const { name,
        surname,
        email,
        subscriptionType,
        subscriptionDate } = req.body;

    /* If necessary detail missing */
    if (!name || !surname || !email) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }

    /* If all necessary details present*/

    // find max id in users array and add 1 to create new id for new user
    const id = users.reduce((max, user) => user.id > max ? user.id : max, 0) + 1;

    // create new user
    const user = { id, name, surname, email, subscriptionType, subscriptionDate };

    //push new user to users array
    users.push(user);

    res.status(201).json({
        success: true,
        message: "New user registered successfully",
        data: user
    });
});

/**
 * @route   GET /users/subscription/:id
 * @desc    Retrieve a user's subscription details and calculate any pending book fines
 * @access  Public
 * @params  {string} id - The unique identifier of the user
 */
router.get("/subscription/:id", (req, res) => {
    // Convert the URL string parameter into a number for strict comparison
    const id = Number(req.params.id);

    // Verify if the user exists in the database
    const user = users.find((u => u.id === id));

    // Guard clause: Return early with a 404 error if user doesn't exist
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User with id: ${id} was not found`
        });
    }

    // Format display elements
    const fullName = `${user.name} ${user.surname}`;

    // Retrieve all books currently checked out by this specific user
    const userBookIssued = issuedBooks.filter((book) => book.userId === id);

    // Sum up the fines from all issued books (defaults to 0 if no books or no fines exist)
    const totalFine = userBookIssued.reduce((total, book) => total + (book.fine || 0), 0);

    // Format the fine output so users see a friendly message if they owe nothing
    const fineDisplay = totalFine > 0 ? totalFine : "No due fine";

    // Consolidate user details, subscription status, and final fine statement
    const result = {
        fullName,
        subscriptionType: user.subscriptionType,
        subscriptionDate: user.subscriptionDate,
        fine: fineDisplay
    };

    // Return the subscription payload
    return res.status(200).json({
        success: true,
        data: result
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: get a user by their ID
 * Access: Public
 * Parametera: id
 */
router.get("/:id", (req, res) => {

    // const { id } = req.params;
    const id = Number(req.params.id);
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        });
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating a user by their ID
 * Access: Public
 * Parametera: id
 */
router.put("/:id", (req, res) => {

    // get passed id from req parameter
    const id = Number(req.params.id);
    const data = req.body;

    // find index of user with passed id
    const index = users.findIndex((user) => user.id === id);

    /* if user is not found */
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        });
    }

    /* if user is present */
    users[index] = {
        ...users[index], ...data
    };

    res.status(200).json({
        success: true,
        message: `user ${id} updated successfully`,
        data: users[index]
    });

});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete a user using their ID
 * Access: Public
 * Parametera: id
 */
router.delete("/:id", (req, res) => {

    // get passed id from request parameter
    const id = Number(req.params.id);

    // find user index with passed id
    const index = users.findIndex((user) => user.id === id);

    /* if user is not found */
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `User with id: ${id} is not found`
        });
    }

    /* if user is present */
    users.splice(index, 1);

    res.status(200).json({
        success: true,
        message: `user ${id} deleted successfully`
    });

});

// export the router
module.exports = router;


