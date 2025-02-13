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

function update(reservationId, tableId) {
  return knex('reservations')
    .where({ reservation_id: reservationId })
    .update({ status: 'seated' })
    .then(() => {
      return knex('tables')
        .where({ table_id: tableId })
        .update({ reservation_id: reservationId })
        .returning('*');
    });
}

function list() {
  return knex('tables').returning('*').orderBy('table_name');
}

function clearTable(tableId, reservationId) {
  return knex('reservations')
    .where({ reservation_id: reservationId })
    .update({ status: 'finished' })
    .returning('*')
    .then(() => {
      return knex('tables')
        .where({ table_id: tableId })
        .update({ reservation_id: null })
        .then(() => readTable(tableId));
    });
}

module.exports = {
  create,
  update,
  list,
  readTable,
  clearTable,
};
