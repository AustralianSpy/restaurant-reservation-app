const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
];

// Middleware to ensure improper properties are not being passed
// into the request. Client form prevents empty properties.
function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;
    console.log(data, "hasvalidprops")

    const invalidProperties = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field) || !field.length
      );
    
    if (invalidProperties.length) {
        return next({ status: 400, message: `Invalid field(s): ${invalidProperties.join(', ')}.` });
    }

    next();
}

const hasAllProperties = hasProperties(VALID_PROPERTIES);

// Check to make sure the date of a new reservation is not in the past
// AND that it is not on a day the restaurant is closed.
// Form validation handles date formatting already.
function hasValidDate(req, res, next) {
    const date = req.body.data.reservation_date;
    const validDate = /\d{4}-\d{2}-\d{2}/.test(date);

    if (!date || !validDate) {
        next({
            status: 400,
            message: 'reservation_date is invalid.',
        });
    }

    next();
}

// Check to make sure the time of a new reservation is not in the past
// AND that it is not at a time when the restaurant is closed.
// Form validation handles time formatting already.
function hasValidTime(req, res, next) {
    const time = req.body.data.reservation_time;
    const validTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);

    if (!time || !validTime) {
        next({
            status: 400,
            message: 'reservation_time is invalid.',
        });
    }
    next();
}

// Check to make sure the party is at least one person.
function hasValidPeople(req, res, next) {
    const { people } = req.body.data;
    const valid = Number.isInteger(people);
    if (people < 1 || !valid) {
        next({ status: 400, message: 'Number of people entered must be at least 1.' });
    }

    next();
}

async function list(req, res) {
    // Request list of all reservations.
    const { date } = req.query;
    
    const reservations = await service.list(date);

    res.json({ data: reservations });
}

async function create(req, res) {
    const newReservation = await service.create(req.body.data);

    res.status(201).json({ data: newReservation });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasAllProperties,
        hasValidProperties,
        hasValidDate,
        hasValidTime,
        hasValidPeople,
        asyncErrorBoundary(create)
    ],
};
