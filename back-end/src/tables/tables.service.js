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
    .join(
      'reservations',
      'tables.reservation_id',
      'reservations.reservation_id'
    )
    .select('*')
    .where({ table_id: tableId })
    .update('reservation_id', reservationId)
    .update('occupied', true)
    .then(() => readTable(tableId));
}

function list() {
  return knex('tables').returning('*').orderBy('table_name');
}

module.exports = {
  create,
  updateTable,
  list,
  readTable,
};
