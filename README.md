# Periodic Tables: A Restaurant Reservation System

This application, _Periodic Tables_, is a reservation system for restaurants.
The software is used by restaurant personnel when a customer calls to request a reservation.
Restaurant personnel can track, edit, and cancel reservations, as well as monitor their available tables.

> Deployment: [Periodic Tables](https://restaurant-reservation-app-client.vercel.app)

## Tech Stack

### Front-end:
- ReactJS
- JavaScript
- CSS3
- HTML5
- BootStrap

### Back-end:
- Node.js
- Express.js
- PostgreSQL
- Knex

## API

The API allows for creation, reading, and updating reservations and tables. A user may not make a request to edit a table or delete a table or reservation at this time.

## Installation and Localhosting

Run `npm preinstall`, followed by `npm install` from the root directory. You may alternatively run `npm install` within the back-end and front-end directories, respectively. From the root directory, run `npm run start` or `npm run start:dev` to concurrently start the server and the client.
