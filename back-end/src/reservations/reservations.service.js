const knex = require('../db/connection');

// Queries for list of all reservations on a given date.
function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "finished" })
        .orderBy("reservation_date")
        .orderBy("reservation_time");
}

// Create a new reservation.
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((result) => result[0]);
}

// Retrieve a single reservation by id.
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

function updateStatus({ reservation_id, status }) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status: status })
        .returning("*")
        .then((updated) => updated[0]);
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*");
}

module.exports = {
    list,
    create,
    read,
    updateStatus,
    update,
};