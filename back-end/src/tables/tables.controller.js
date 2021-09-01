const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const { table } = require('../db/connection');

const validProperties = ['table_name', 'capacity'];

function hasProperties(req, res, next) {
  const { data = {} } = req.body;
  validProperties.forEach((property) => {
    if (!data[property]) {
      next({
        status: 400,
        message: `A '${property}' property is required.`,
      });
    }
  });
  next();
}

function hasValidName(req, res, next) {
  const { table_name } = req.body.data;
  if (!table_name || table_name === '' || table_name.length < 2) {
    next({
      status: 400,
      message: `The table must have a table_name property that is at least two characters long.`,
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (!capacity || capacity < 1 || typeof capacity !== 'number') {
    next({
      status: 400,
      message: `The table must have a capacity of at least 1.`,
    });
  }
  next();
}

async function updateTable(req, res, next) {
  const reservation_id = req.body.data.reservation_id;
  const table_id = req.body.data.table_id;
  res.json({ data: await service.updateTable(reservation_id, table_id) });
}

async function create(req, res, next) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function list(req, res, next) {
  res.json({ data: await service.list() });
}

module.exports = {
  create: [
    // asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(hasProperties),
    asyncErrorBoundary(hasValidName),
    asyncErrorBoundary(hasValidCapacity),
    asyncErrorBoundary(create),
  ],
  update: asyncErrorBoundary(updateTable),
  list: asyncErrorBoundary(list),
};
