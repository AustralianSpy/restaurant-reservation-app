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

async function list(req, res) {
    res.json({ data: await service.list() });
}

module.exports = {
    list: asyncErrorBoundary(list),
}
