/* This is a route handler for managing users */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import users data
const { users } = require("../data/users.json");

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


