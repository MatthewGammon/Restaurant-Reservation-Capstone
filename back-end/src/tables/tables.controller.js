const service = require('./tables.service');
const resService = require('../reservations/reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

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

function hasData(req, res, next) {
  const data = req.body.data;
  if (data) {
    next();
  } else {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  }
}

async function resExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    next({
      status: 400,
      message: `A reservation_id is required`,
    });
  }
  const reservation = await resService.read(reservation_id);
  if (reservation) {
    res.locals.res = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `A reservation with the id ${reservation_id} was not found.`,
    });
  }
}

async function tableExists(req, res, next) {
  const table_id = Number(req.params.table_id);
  console.log('table exists: table is', table_id);
  console.log('---');
  const table = await service.readTable(table_id);
  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `Table with id ${table_id} does not exist.`,
    });
  }
}

function tableIsFree(req, res, next) {
  const occupied = res.locals.table.occupied;
  if (occupied) {
    next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is currently occupied. Please select another table.`,
    });
  }
  next();
}

async function getPeople(req, res, next) {
  const people = res.locals.res.people;
  if (people) {
    res.locals.partySize = people;
    next();
  } else {
    next({
      status: 400,
      message: `People is not defined`,
    });
  }
}

function validateTableSeating(req, res, next) {
  const partySize = res.locals.partySize;
  const capacity = res.locals.table.capacity;
  if (partySize > capacity) {
    next({
      status: 400,
      message: `The party size is greater than the table capacity. Please select another table.`,
    });
  }
  next();
}

async function create(req, res, next) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function updateTable(req, res, next) {
  const { reservation_id } = req.body.data;
  const table_id = req.body.data.table_id || Number(req.params.table_id);
  res.json({ data: await service.updateTable(reservation_id, table_id) });
}

async function list(req, res, next) {
  res.json({ data: await service.list() });
}

async function validateOccupation(req, res, next) {
  const table_id = Number(req.params.table_id);
  const table = await service.readTable(table_id);

  if (table.reservation_id) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 400,
      message: `Table is not occupied.`,
    });
  }
}

async function destroy(req, res) {
  const table_id = req.params.table_id;
  await service.clearTable(table_id);
  res.sendStatus(204);
}

module.exports = {
  create: [
    asyncErrorBoundary(hasProperties),
    asyncErrorBoundary(hasValidName),
    asyncErrorBoundary(hasValidCapacity),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(resExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsFree),
    asyncErrorBoundary(getPeople),
    asyncErrorBoundary(validateTableSeating),
    asyncErrorBoundary(updateTable),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateOccupation),
    asyncErrorBoundary(destroy),
  ],
  list: asyncErrorBoundary(list),
};
