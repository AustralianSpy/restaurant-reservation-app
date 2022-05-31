const service = require("./reservations.service");
const asyncErrorBoundary =  require("../errors/asyncErrorBoundary");

async function list(req, res) {
    // Request list of all reservations.
    const reservations = await service.list();

    res.json({ data: reservations });
}

module.exports = {
    list: asyncErrorBoundary(list),
};
