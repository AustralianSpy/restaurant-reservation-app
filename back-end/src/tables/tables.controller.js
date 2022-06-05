const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
    "reservation_id",
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

const hasAllProperties = hasProperties(["table_name", "capacity"]);
const hasReservationID = hasProperties(["reservation_id"]);

// Middleware to check that a table being created has at least 2 characters.
function hasValidName(req, res, next) {
    const { table_name } = req.body.data;

    if (table_name.length < 2) {
        next({
            status: 400,
            message: 'table_name must be at least 2 characters long.',
        });
    }
    next();
}

// Middleware to check table capacity is greater than 1.
function hasValidCapacity(req, res, next) {
    const { capacity } = req.body.data;
    const capacityCheck = Number(capacity);

    if (isNaN(capacity) || capacityCheck < 1) {
        next({
            status: 400,
            message: 'capacity cannot be less than 1.',
        });
    }
    next();
}

async function list(req, res) {
    res.json({ data: await service.list() });
}

async function create(req, res) {
    const newTable = await service.create(req.body.data);

    res.status(201).json({ data: newTable });
}

// Middlewares to check before updating a table that an associated reservation
// is not beyond the table's capacity.
async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await reservationsService.read(reservation_id);

    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }

    return next({
        status: 404,
        message: `Reservation #${reservation_id} not found.`,
    });
}

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (table) {
        res.locals.table = table;
        return next();
    }

    next({
        status: 404,
        message: `Table #${table_id} not found.`,
    });
}

// Middlewares to check if number of people exceed table capacity or if
// table is already reserved.
function hasValidReservation(req, res, next) {
    const { people } = res.locals.reservation;
    const { capacity } = res.locals.table;
    
    if (people > capacity) {
        return next({
            status: 400,
            message: `Number of people in reservation (${people}) cannot exceed max capacity of table.`,
        });
    }

    next();
}

function hasFreeStatus (req, res, next) {
    const { reservation_id, table_name } = res.locals.table;
    console.log(reservation_id);
    if (reservation_id !== null) {
        return next({
            status: 400,
            message: `Table ${table_name} is already occupied. Please choose a different table.`,
        });
    }

    next();
}

async function update(req, res) {
    const { table_id } = res.locals.table;
    const { reservation_id } = res.locals.reservation;

    const updatedTable = {
        table_id: table_id,
        reservation_id: reservation_id,
    };

    res.status(200).json({ data: await service.update(updatedTable) });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasAllProperties,
        hasValidProperties,
        hasValidName,
        hasValidCapacity,
        asyncErrorBoundary(create),
    ],
    update: [
        hasValidProperties,
        hasReservationID,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        hasFreeStatus,
        hasValidReservation,
        asyncErrorBoundary(update),
    ],
}
