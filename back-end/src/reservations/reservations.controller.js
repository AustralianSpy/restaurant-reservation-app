const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const properties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
]

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
    create: asyncErrorBoundary(create),
};
