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

function hasValidProperties(req, res, next) {
  const reservation = req.body.data;
  for (let prop in reservation) {
    if (!validProperties.includes(prop)) {
      return next({
        status: 400,
        message: `'${prop}' is not a valid property for a new reservation`,
      });
    }
  }
  next();
}

function hasAllProperties(req, res, next) {
  const keys = Object.keys(req.body.data);
  let difference = validProperties.filter((prop) => !keys.includes(prop));
  if (difference.length) {
    return next({
      status: 400,
      message: `Reservation request is missing the following properties: ${difference}`,
    });
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

  //last OR takes the number string and converts it to a number, then passes it to isNaN to verify that only numerical characters are contained.
  if (mobile_number === '' || numOnly.length !== 10 || isNaN(Number(numOnly))) {
    next({
      status: 400,
      message: `Property ${validProperties[index]} cannot be empty and must contain only numbers 0-9 in the format 123-123-1234`,
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

  if (!reservation_date) {
    next({
      status: 400,
      message: `Please select a date.`,
    });
  }
  if (submitDate < today) {
    next({
      status: 400,
      message: `The date and time cannot be in the past. Today is ${today}.`,
    });
  }
  if (dayAsNum === invalidDate) {
    next({
      status: 400,
      message: `The restaurant is not open on Tuesdays. Please select a different day.`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (!reservation_time) {
    next({
      status: 400,
      message: `Please select a time.`,
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
  if (people < 1) {
    next({
      status: 400,
      message: `Parties must have a minimum size of at least 1 person.`,
    });
  }
  next();
}

async function list(req, res) {
  const { date } = req.query;
  res.json({
    data: await service.listByDate(date),
  });
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  create: [
    asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(hasAllProperties),
    asyncErrorBoundary(hasFirstName),
    asyncErrorBoundary(hasLastName),
    asyncErrorBoundary(hasMobileNumber),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(hasValidTime),
    asyncErrorBoundary(hasValidPartySize),
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
