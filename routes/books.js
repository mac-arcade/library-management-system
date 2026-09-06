/* This is a route handler for managing books */

// import express
const express = require("express");

// create express router
const router = express.Router();

// import books data
const { books } = require("../data/books.json");

module.exports = router;