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
        .update(updatedTable, "*")
}

module.exports = {
    list,
    create,
    update,
};