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

// Lists all reservations with full or partial mobile_number match to search input.
function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
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
        .update('status', status)
        .returning("*")
        .then((updated) => updated[0]);
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, [
            "first_name",
            "last_name",
            "mobile_number",
            "people",
            "reservation_date",
            "reservation_time"
        ])
        .returning("*")
        .then((updated) => updated[0]);
}

module.exports = {
    list,
    search,
    create,
    read,
    updateStatus,
    update,
};