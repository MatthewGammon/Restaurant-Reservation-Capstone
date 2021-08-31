const knex = require('../db/connection');

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecord) => createdRecord[0]);
}

function listByDate(date) {
  return knex('reservations')
    .select('*')
    .where({ 'reservations.reservation_date': date })
    .orderBy('reservations.reservation_time');
}

module.exports = {
  create,
  listByDate,
};
