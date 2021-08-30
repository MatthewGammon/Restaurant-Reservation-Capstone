const knex = require('../db/connection');

function create(table) {
  return knex('tables').insert(table).returning('*');
}

function list() {
  return knex('tables').returning('*');
}

module.exports = {
  create,
  list,
};
