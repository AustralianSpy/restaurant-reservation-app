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
function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*");
}

// Retrieve one table.
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

// Removes associated reservation from a given table.
function finish(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .update({ reservation_id: null });
}

module.exports = {
    list,
    create,
    update,
    read,
    finish,
};