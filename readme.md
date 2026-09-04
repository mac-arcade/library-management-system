# library-management-system

    This is a library management API Backend for the management of users and the books

# Routes and the Endpoints

## /users
GET: get all the list of users in the system
POST: register a new user

## /users{id}
GET: get a user by their ID
PUT: udate the user by their ID
DELETE: delete a user by their ID (Check if the user still has an issued book) && (is there any fine/penalty to be collected)

## /users/subscription-details/{id}
GET: get a user subscription details by their ID
    >> date of subscription
    >> validity?
    >> fine if any?

## /books
GET: get all the books in the system
POST: add a new book to the system

## /books{id}
GET: get a book by its ID
PUT: update a book by its ID
DELETE: delete a book by its ID

## /books/issued
GET: get all the issued books

## /books/issued/withFine
GET: get all issued books with their fine amount

### Subscription Types
    >> Basic (3 months)
    >> Standard (6 months)
    >> Premium (12 months)

> > If a user missed the renewal date, then user should be collected with ₹100
> > If a user missed his subscription, then user is expected to pay ₹100
> > If a user missed both renewal and subscription, then the collected amount should be ₹200

## Commands: 
npm init
npm i express 
npm i nodemon --save-dev

npm run dev

To restore node modules and package-lock.json --> npm i / npm install