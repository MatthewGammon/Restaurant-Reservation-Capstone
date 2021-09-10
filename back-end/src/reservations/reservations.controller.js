const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */

const validProperties = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
];

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

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }
  next();
}

function hasProperties(req, res, next) {
  const keys = Object.keys(req.body.data);
  if (keys.length === 0) {
    next({
      status: 400,
      message: `You can not submit a request with no properties. Please start by entering a 'first_name' property.`,
    });
  }
  for (let prop of validProperties) {
    if (!keys.includes(prop)) {
      next({
        status: 400,
        message: `A ${prop} property is required.`,
      });
    }
  }
  next();
}

function hasFirstName(req, res, next) {
  const index = validProperties.indexOf('first_name');
  const { first_name } = req.body.data;
  if (first_name === '' || typeof first_name !== 'string') {
    next({
      status: 400,
      message: `Property ${validProperties[index]} cannot be empty and must be a string`,
    });
  }
  next();
}

function hasLastName(req, res, next) {
  const index = validProperties.indexOf('last_name');
  const { last_name } = req.body.data;
  if (last_name === '' || typeof last_name !== 'string') {
    next({
      status: 400,
      message: `Property ${validProperties[index]} cannot be empty and must be a string`,
    });
  }
  next();
}

function hasMobileNumber(req, res, next) {
  const index = validProperties.indexOf('mobile_number');
  const { mobile_number } = req.body.data;
  const splitNumber = mobile_number.split('-');
  const numOnly = splitNumber.join('');

  if (mobile_number === '' || isNaN(Number(numOnly))) {
    next({
      status: 400,
      message: `Property ${validProperties[index]} cannot be empty and must be a string containing only numbers 0-9 in the format 123-123-1234`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const invalidDate = 2;
  const submitDate = new Date(reservation_date + ' ' + reservation_time);
  const dayAsNum = submitDate.getDay();
  const today = new Date();

  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  if (!reservation_date) {
    next({
      status: 400,
      message: `reservation_date cannot be empty. Please select a date.`,
    });
  }
  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `the reservation_date must be a valid date in the format 'YYYY-MM-DD'`,
    });
  }
  if (submitDate < today) {
    next({
      status: 400,
      message: `The date and time cannot be in the past. Please select a future date. Today is ${today}.`,
    });
  }
  if (dayAsNum === invalidDate) {
    next({
      status: 400,
      message: `The restaurant is closed on Tuesdays. Please select a different day.`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeFormat = /\d\d:\d\d/;

  if (!reservation_time) {
    next({
      status: 400,
      message: `reservation_time cannot be empty. Please select a time.`,
    });
  }
  if (!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `the reservation_time must be a valid time in the format '12:30`,
    });
  }
  if (reservation_time < '10:29:59') {
    next({
      status: 400,
      message: 'The restaurant does not open until 10:30 a.m.',
    });
  } else {
    if (reservation_time >= '21:30:00') {
      next({
        status: 400,
        message: `The restaurant closes at 22:30 (10:30 pm). Please schedule your reservation at least one hour before close.`,
      });
    }
  }
  next();
}

function hasValidPartySize(req, res, next) {
  const { people } = req.body.data;
  if (people < 1 || typeof people !== 'number') {
    next({
      status: 400,
      message: `The 'people' property must have a value that is a number and be greater than 0.`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_Id } = req.params;
  const foundRes = await service.read(reservation_Id);

  if (foundRes) {
    res.locals.res = foundRes;
    return next();
  }
  next({
    status: 404,
    message: `No reservation found for id ${reservation_Id}.`,
  });
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

async function read(req, res) {
  res.json({ data: await service.read(res.locals.res.reservation_id) });
}

async function updateStatus(req, res) {
  const reservation_id = res.locals.res.reservation_id;
  const { status } = req.body.data;
  res.json({ data: await service.updateStatus(reservation_id, status) });
}

async function list(req, res) {
  const date = req.query.date || new Date();
  res.json({
    data: await service.listByDate(date),
  });
}

module.exports = {
  create: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(hasProperties),
    asyncErrorBoundary(hasFirstName),
    asyncErrorBoundary(hasLastName),
    asyncErrorBoundary(hasMobileNumber),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(hasValidTime),
    asyncErrorBoundary(hasValidPartySize),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  list: asyncErrorBoundary(list),
};
