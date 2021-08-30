const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function create(req, res, next) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function list(req, res, next) {
  res.json({ data: await service.list() });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
