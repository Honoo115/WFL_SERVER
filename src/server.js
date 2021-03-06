const app = require("./app");
const knex = require("knex");
const { PORT, DATABASE_URL } = require("./config");
const DB = knex({
  client: "pg",
  connection: DATABASE_URL
});
app.set("db", DB);
app.listen(PORT, () => {
  (`Server listening at http://localhost:${PORT}`);
});
