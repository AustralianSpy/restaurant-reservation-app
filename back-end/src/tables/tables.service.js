const knex = require('../db/connection');

// Queries for list of all tables.
function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

// Create a new table.
function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((result) => result[0]);
}

// Update an existing table.
function update({ reservation_id, table_id }) {
    return knex.transaction((trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({ reservation_id })
            .update({ status: "seated" })
            .then(() => {
                return knex("tables")
                    .transacting(trx)
                    .where({ table_id })
                    .update({ reservation_id: reservation_id })
                    .returning("*")
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
    
    /*return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*");*/
}

// Retrieve one table.
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

// Removes associated reservation from a given table.
function finish({ table_id, reservation_id }) {
    return knex.transaction((trx) => {
        return knex("reservations")
            .transacting(trx)
            .where({ reservation_id })
            .update({ status: "finished" })
            .then(() => {
                return knex("tables")
                    .transacting(trx)
                    .where({ table_id })
                    .update({ reservation_id: null })
                    .returning("*")
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
}

module.exports = {
    list,
    create,
    update,
    read,
    finish,
};