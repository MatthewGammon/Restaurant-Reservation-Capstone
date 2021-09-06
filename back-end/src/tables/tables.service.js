const knex = require('../db/connection');

function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((createdTable) => createdTable[0]);
}

function readTable(tableId) {
  return knex('tables').select('*').where({ table_id: tableId }).first();
}

function updateTable(reservationId, tableId) {
  return knex('tables')
    .where({ table_id: tableId })
    .update('reservation_id', reservationId)
    .then(() => readTable(tableId));
}

function list() {
  return knex('tables').returning('*').orderBy('table_name');
}

function clearTable(tableId) {
  return knex('tables')
    .where({ table_id: tableId })
    .update({ reservation_id: null })
    .then(() => readTable(tableId));
}

module.exports = {
  create,
  updateTable,
  list,
  readTable,
  clearTable,
};
