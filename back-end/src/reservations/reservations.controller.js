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
    "status",
    "reservation_id",
    "created_at",
    "updated_at",
];

// Middleware to ensure improper properties are not being passed
// into the request. Client form prevents empty properties.
function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidProperties = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field) || !field.length
      );
    
    if (invalidProperties.length) {
        return next({ status: 400, message: `Invalid field(s): ${invalidProperties.join(', ')}.` });
    }

    next();
}

const hasAllProperties = hasProperties(VALID_PROPERTIES.slice(0, -4));

// Check to make sure the date of a new reservation is not in the past
// AND that it is not on a day the restaurant is closed.
// Form validation handles date formatting already.
function hasValidDate(req, res, next) {
    const date = req.body.data.reservation_date;
    const validDate = /\d{4}-\d{2}-\d{2}/.test(date);

    if (!date || !validDate) {
        next({
            status: 400,
            message: 'reservation_date is not a valid date.',
        });
    }

    next();
}

// Middleware splits dates apart to strip them of timezone so validation can
// assume the inputed date is in the same timezone as the user.
function hasFutureDate(req, res, next) {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentDate = new Date(`${currentMonth}-${currentDay}-${currentYear}`);

    const reservation = req.body.data.reservation_date;
    const resYear = reservation.substr(0, 4);
    const resMonth =  reservation.substr(5, 2);
    const resDay =  reservation.substr(8, 2);
    const reservationDate = new Date(`${resMonth}-${resDay}-${resYear}`);

    let future = true;
    if (currentDate > reservationDate) future = false;
    
    if (!reservation || !future) {
        next({
            status: 400,
            message: 'reservation_date must be a future date.',
        });
    }

    // Store whether the reservation is being made for TODAY for future use.
    (currentDate.getTime() == reservationDate.getTime()) ? res.locals.today = true : res.locals.today = false;
    next();
}

function nonTuesdayDate(req, res, next) {
    const reservation = req.body.data.reservation_date;
    const date = new Date(reservation);
    const day = date.getDay();

    if (day === 1) {
        next({
            status: 400,
            message: "reservation_date cannot be on a Tuesday. Sorry, we're closed!",
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

function hasFutureTime(req, res, next) {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    

    const reservation = req.body.data.reservation_time;
    const resHours = Number(reservation.substr(0, 2));
    const resMins = Number(reservation.substr(3, 4));

    // Check if time is before current time if reservation is being made for today.
    // Previously stored value.
    if (res.locals.today === true) {
        if (resHours < currentHours || (resMins <= currentMins && resHours <= currentHours)) {
            next({
                status: 400,
                message: 'reservation_time must be a future time.',
            });
        }
    } else if ((resHours === 21 && resMins > 30) || resHours > 21) {
        next({
            status: 400,
            message: 'reservation_time must be more than an hour before closing at 10:30 PM.',
        });
    } else if (resHours <= 10 || (resHours === 10 && resMins < 30)) {
        next({
            status: 400,
            message: 'reservation_time cannot be before we open at 10:30 AM.'
        })
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
    // Request list of all reservations for for specific date or mobile_number.
    const { date, mobile_number } = req.query;
    if (date) {
        const reservations = await service.list(date);
        res.json({ data: reservations });
    } else if (mobile_number) {
        const reservations = await service.search(mobile_number);
        res.json({ data: reservations });
    }    
}

// Middleware to prevent newly-created reservation from having a status other than "booked".
function hasBookedStatus(req, res, next) {
    const { status } = req.body.data;

    if (status && status !== 'booked') {
        return next({
            status: 400,
            message: `Invalid status of "${status}". Reservation cannot have a status other than "booked".`,
        });
    }
    next();
}

async function create(req, res) {
    const newReservation = await service.create(req.body.data);

    res.status(201).json({ data: newReservation });
}

// Middleware to prevent attempt to read / update nonexistent reservation.
async function reservationExists(req, res, next) {
    const { reservation_id } = req.params;
    const reservation = await service.read(reservation_id);
    
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }

    return next({
        status: 404,
        message: `Reservation #${reservation_id} not found.`,
    });
}

async function read(req, res) {
    const { reservation_id } = req.params;
    const reservation = await service.read(reservation_id);
    
    res.json({ data: reservation });
}

// Middleware to validate a change in status for pre-existing reservation.
function hasValidStatus(req, res, next) {
    const { status } = res.locals.reservation;
    const updatedStatus = req.body.data.status.toLowerCase().trim();

    const validStatus = ["booked", "seated", "finished", "cancelled"];

    if (!updatedStatus || !validStatus.includes(updatedStatus)) {
        return next({
            status: 400,
            message: `Unknown status "${updatedStatus}". Please enter a valid status.`,
        });
    } else if (status === "finished") {
        return next({
            status: 400,
            message: `Cannot change status of finished reservation.`,
        });
    }

    next();
}

async function updateStatus(req, res) {
    const { reservation_id } = res.locals.reservation;
    const { status } = req.body.data;

    const updatedReservation = {
        reservation_id: reservation_id,
        status: status,
    };

    res.status(200).json({ data: await service.updateStatus(updatedReservation) });
}

async function update(req, res) {
    const { reservation_id } = res.locals.reservation;
    const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } } = req.body;

    const updatedReservation = {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        reservation_id: reservation_id,
    };

    const response = await service.update(updatedReservation);

    res.status(200).json({ data: {
        ...response,
        [response.reservation_date]: response.reservation_date.toString(),
        [response.reservation_time]: response.reservation_time.toString(),
    }  });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasAllProperties,
        hasValidProperties,
        hasValidDate,
        hasFutureDate,
        nonTuesdayDate,
        hasValidTime,
        hasFutureTime,
        hasValidPeople,
        hasBookedStatus,
        asyncErrorBoundary(create)
    ],
    read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(reservationExists),
        hasAllProperties,
        hasValidProperties,
        hasValidDate,
        hasFutureDate,
        nonTuesdayDate,
        hasValidTime,
        hasFutureTime,
        hasValidPeople,
        asyncErrorBoundary(update)
    ],
    updateStatus: [
        asyncErrorBoundary(reservationExists),
        hasValidStatus,
        asyncErrorBoundary(updateStatus)
    ],
};
