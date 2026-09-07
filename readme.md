# Library Management System

This is a backend API for managing library users, books, book copies, subscriptions, and issued books.

## Routes and Endpoints

### `/users`

**GET**
Get all users in the system.

**POST**
Register a new user.

---

### `/users/:id`

**GET**
Get a user by their ID.

**PUT**
Update a user by their ID.

**DELETE**
Delete a user by their ID.

Before deleting a user, check:

* whether the user currently has any issued books
* whether any fine or penalty is pending

---

### `/users/subscription-details/:id`

**GET**
Get subscription details for a user by their ID.

Subscription details may include:

* subscription type
* subscription date
* subscription validity
* renewal date
* pending fine or penalty

---

## Books

### `/books`

**GET**
Get all books in the system.

**POST**
Add a new book to the system.

---

### `/books/:id`

**GET**
Get a book by its ID.

**PUT**
Update a book by its ID.

**DELETE**
Delete a book by its ID.

---

### `/books/issued`

**GET**
Get all currently issued books.

---

### `/books/issued/withFine`

**GET**
Get all issued books that currently have a fine, along with the fine amount.

---

## Book and Issue Data Structure

The system separates books, physical book copies, users, and issue records.

### `users.json`

Stores user information such as:

* user ID
* name
* surname
* email
* subscription type
* subscription date

Issued-book information should not be stored directly inside the user object.

---

### `books.json`

Stores information about a book title, such as:

* book ID
* title
* author
* genre
* price
* publisher

A book record represents the book title/details, not an individual physical copy.

---

### `bookCopies.json`

Stores individual physical copies of books.

Example fields:

* copy ID
* book ID
* status

Possible statuses may include:

* available
* issued
* lost
* damaged

Multiple copies can reference the same `bookId`.

For example, three physical copies of the same book can have different `copyId` values while sharing the same `bookId`.

---

### `issuedBooks.json`

Stores book-issue transactions.

Example fields:

* issue ID
* user ID
* copy ID
* issued date
* expected return date
* actual return date
* status
* fine amount

This structure allows:

* one user to issue multiple books
* one book title to have multiple physical copies
* each physical copy to be tracked separately
* issue history to be maintained independently from user data

---

## Subscription Types

* **Basic** — 3 months
* **Standard** — 6 months
* **Premium** — 12 months

### Subscription Penalties

* If a user misses the renewal date, a penalty of **₹100** should be collected.
* If a user has an expired subscription, a penalty of **₹100** should be collected.
* If both renewal and subscription penalties apply, the total collected amount should be **₹200**.

---

## Commands

Initialize the project:

```bash
npm init
```

Install Express:

```bash
npm install express
```

Install Nodemon as a development dependency:

```bash
npm install nodemon --save-dev
```

Run the development server:

```bash
npm run dev
```

Restore dependencies from `package.json`:

```bash
npm install
```

or:

```bash
npm i
```

`npm install` recreates the `node_modules` directory and installs the dependencies listed in `package.json`.

If `package-lock.json` already exists, npm uses it to install the locked dependency versions.
