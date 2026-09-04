// import express module
const express = require("express");

// create express app
const app = express();

// use the environment port or default to 3000
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Library Management System API"
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Page not found"
    });
});

// app.all('/*splat', (req, res) => {
//     res.status(500).json({
//         message: "Not built Yet"
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

