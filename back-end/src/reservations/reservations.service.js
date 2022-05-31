const knex = require('../db/connection');

// Queries for list of all reservations.
function list() {
    return knex("reservations").select("*");
}

// Queries for list of all reservations on a certain date.
function listByDate(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date });
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

module.exports = {
    list,
    listByDate,
    create,
};