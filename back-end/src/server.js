const { PORT = 5001 } = process.env;
console.log(process.env.PORT)

const app = require("./app");
const knex = require("./db/connection");

/*
knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });
*/

app.listen(PORT, listener);

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
