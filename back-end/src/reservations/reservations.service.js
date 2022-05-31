const knex = require('../db/connection');

// Queries for list of all reservations.
function list() {
    return knex('reservations').select('*');
}

// Queries for list of all reservations on a certain date.
function listByDate(date) {
    return knex('reservations')
        .select('*')
        .where({ reservation_date: date });
}

module.exports = {
    list,
    listByDate,
};