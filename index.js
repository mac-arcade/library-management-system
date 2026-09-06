// import express module
const express = require("express");

// import the routers
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

// create express app
const app = express();

// use the environment port or default to 3000
const port = process.env.PORT || 3000;

// middleware to parse JSON request bodies
app.use(express.json());

/**
 * Route: /
 * Method: GET
 * Description: default route / home route
 * Access: Public
 * Parametera: none
 */
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Library Management System API"
    });
});

// Route: /users
app.use("/users", usersRouter);

// Route: /books
app.use("/books", booksRouter);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        message: "Page not found"
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// app.all('/*splat', (req, res) => {
//     res.status(500).json({
//         message: "Not built Yet"
//     });
// });