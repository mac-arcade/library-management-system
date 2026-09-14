/* This is a route handler for managing users */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import users data
const { users } = require("../data/users.json");

// import book issue transaction data
const { issuedBooks } = require("../data/issuedBooks.json");

// helper function to calculate remaining subscription validity
function checkValidity(end, today) {

    // calculate the total remaining time in seconds
    const timeLeft = Math.ceil((end.getTime() - today.getTime()) / 1000);

    // if no time is left, the subscription has expired
    if (timeLeft <= 0) {
        return "validity expired";
    }

    // store remaining seconds so we can break them into - months, days, hours, minutes, seconds
    let remainingTime = timeLeft;

    // Average number of seconds in a month
    // 30.42 = average number of days per month in a year
    const secInMonth = 60 * 60 * 24 * 30.42;

    // Number of seconds in one day
    const secInDay = 60 * 60 * 24

    // Number of seconds in one hour
    const secInHour = 60 * 60

    // Number of seconds in one minute
    const secInMinute = 60

    // Calculate complete remaining months
    const monthsLeft = Math.floor(remainingTime / secInMonth);

    // Remove complete months from remaining time
    remainingTime %= secInMonth;

    // Calculate complete remaining days
    const daysLeft = Math.floor(remainingTime / secInDay);

    // Remove complete days from remaining time
    remainingTime %= secInDay;

    // Calculate complete remaining hours
    const hoursLeft = Math.floor(remainingTime / secInHour);

    // Remove complete hours from remaining time
    remainingTime %= secInHour;

    // Calculate complete remaining minutes
    const minutesLeft = Math.floor(remainingTime / secInMinute);

    // Whatever remains after removing minutes is seconds
    const secondsLeft = Math.floor(remainingTime % secInMinute);

    return `${monthsLeft} months ${daysLeft} days ${hoursLeft} hours ${minutesLeft} minutes ${secondsLeft} seconds left`;
}

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

    // send success status, message, and data
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
    const totalFine = userBookIssued.reduce((total, book) => total + Number(book.fine || 0), 0);

    // Format the fine output so users see a friendly message if they owe nothing
    const fineDisplay = totalFine > 0 ? totalFine : "No due fine";

    // Initialize subscription duration in days
    let subscriptionDays = 0;

    // Assign subscription duration based on subscription type
    switch (user.subscriptionType) {

        case "Basic":

            subscriptionDays = 90;
            break;

        case "Standard":

            subscriptionDays = 180;
            break;

        case "Premium":

            subscriptionDays = 365;
            break;

        default:
            subscriptionDays = 0;
            break;
    }

    // Get subscription date from user data
    const subscriptionDate = user.subscriptionDate;

    // Convert subscription date string into a JavaScript Date object
    const subStartDate = new Date(subscriptionDate);

    // Create a separate Date object for calculating the renewal date
    const renewalDate = new Date(subStartDate);

    // Add the subscription duration to calculate renewal date
    renewalDate.setDate(renewalDate.getDate() + subscriptionDays);

    // Get current date and time
    const today = new Date();

    // Calculate remaining subscription validity
    const validity = checkValidity(renewalDate, today);

    // Consolidate user details, subscription status, and final fine statement
    const result = {
        fullName,
        subscriptionType: user.subscriptionType,
        subscriptionDate: user.subscriptionDate,
        renewalDate: renewalDate.toISOString().split("T")[0],
        validity,
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

    // user is not found
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        });
    }

    // send success status and message
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

    // send success status and message
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

    // Get user id from request parameter
    const id = Number(req.params.id);

    // Find user index using the provided id
    const index = users.findIndex((user) => user.id === id);

    /* If user does not exist, return 404 */
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `User with id: ${id} is not found`
        });
    }

    // Get the actual user data
    const user = users[index]

    // Find all books currently issued to this user
    const rentedBooks = issuedBooks.filter(
        (issue) => issue.userId === id
    );

    // Prevent deletion while the user still has issued books
    if (rentedBooks.length > 0) {
        return res.status(409).json({
            success: false,
            message: `User ${user.name} ${user.surname} with id ${id} has ${rentedBooks.length} issued book(s). Collect the books and clear any pending fines before deleting the user.`,
            data: rentedBooks
        });
    }



    // Delete user from users array
    users.splice(index, 1);

    // Send successful deletion response
    res.status(200).json({
        success: true,
        message: `User ${user.name} ${user.surname} with id ${id} deleted successfully`
    });

});

// export the router
module.exports = router;


