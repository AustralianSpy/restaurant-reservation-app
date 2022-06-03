const service = require("./tables.service");
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

    if (isNaN(capacityCheck) || capacityCheck < 1) {
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

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasValidProperties,
        hasAllProperties,
        hasValidName,
        hasValidCapacity,
        asyncErrorBoundary(create),
    ],
}
