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
    const { data = {} } = req.body;
    const newReservation = service.create(data);

    /* const { data: { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;

    const newReservation = {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people
    };

    const response = await service.create(newReservation); */

    res.status(201).json({ data: newReservation });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasProperties(properties), asyncErrorBoundary(create)],
};
