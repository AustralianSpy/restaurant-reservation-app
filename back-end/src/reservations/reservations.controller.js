const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware to ensure improper properties are not being passed
// into the request. Client form prevents empty properties.
function hasValidProperties(req, res, next) {
    const VALID_PROPERTIES = [
        "first_name",
        "last_name",
        "mobile_number",
        "reservation_date",
        "reservation_time",
        "people",
    ];
    const { data = {} } = req.body;

    const invalidProperties = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field) || !field.length
      );
    
    if (invalidProperties.length) {
        return next({ status: 400, message: `Invalid properties: ${invalidProperties.join(', ')}.` });
    }

    res.locals.reservation = data;
    next();
}

// Check to make sure the date of a new reservation is not in the past
// AND that it is not on a day the restaurant is closed.
// Form validation handles date formatting already.
function hasValidDate(req, res, next) {
    const { reservation_date } = res.locals.reservation;
    next();
}

// Check to make sure the time of a new reservation is not in the past
// AND that it is not at a time when the restaurant is closed.
// Form validation handles time formatting already.
function hasValidTime(req, res, next) {
    const { reservation_time } = res.locals.reservation;
    next();
}

// Check to make sure the party is at least one person.
function hasValidPeople(req, res, next) {
    const { people } = res.locals.reservation;

    if (people < 1) {
        next({ status: 400, message: 'Reservation must be for at least 1 person.' });
    }

    next();
}

async function list(req, res) {
    // Request list of all reservations.
    const reservations = await service.list();

    res.json({ data: reservations });
}

async function create(req, res) {
    const newReservation = await service.create(req.body.data);

    res.status(201).json({ data: newReservation });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        asyncErrorBoundary(hasValidProperties),
        asyncErrorBoundary(hasValidPeople),
        asyncErrorBoundary(create)
    ],
};
