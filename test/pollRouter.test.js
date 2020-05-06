require("dotenv").config();
const app = require("../src/app");
const knex = require("knex");

describe(`Endpoint Tests`, () => {

  let db;
  let testPolls = [
    {
      uuid: "b0439de8-fc14-4f39-922a-ce2ac6663a6b",
      city: "Seattle",
      postal_code: null
    }
  ];

  // This runs after everything is done
  // AK: I would recommend keeping the after, before, beforeach etc at the top
  after(`disconnect from db`, () => {
    return db.destroy();
  });

  // Before any test runs, clean the database
  before(`connect to db`, () => {
    // console.log(process.env.TEST_DATABASE_URL) // like this
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  // After every test
  afterEach(`clean up database`, () => {
    return db.raw("TRUNCATE polls RESTART IDENTITY CASCADE;");
  });

  describe("GET /poll", () => {

    beforeEach(`seed the database`, () => {

      return db.transaction(async trx => {
        // AK: These both need to be inserted into the database separately.

        await trx.into("polls").insert(testPolls);
      });

    });

    it(`Responds with 200 with an array of poll objects`, () => {
      return supertest(app)
        .get("/poll")
        .expect(200)
        .expect(res => {
          expect(res.body[0].uuid).to.eql(testPolls[0].uuid);
          expect(res.body[0].city).to.eql(testPolls[0].city);
          expect(res.body[0].postal_code).to.eql(testPolls[0].postal_code);

          // console.log("res.body: " + JSON.stringify(res.body));

          // console.log("testPolls: " + JSON.stringify(testPolls));

        });
    });

    // 
  });

  describe("GET /poll/:uuid", () => {
    beforeEach(`seed the database`, () => {

      return db.transaction(async trx => {
        // AK: These both need to be inserted into the database separately.

        await trx.into("polls").insert(testPolls);
      });

    });

    it(`Responds with 200 with an poll object`, () => {
      let ourUUID = testPolls[0].uuid;
      return supertest(app)
        .get(`/poll/${ourUUID}`)
        .expect(200)
        .expect(res => {
          expect(res.body.uuid).to.eql(testPolls[0].uuid);
          expect(res.body.city).to.eql(testPolls[0].city);
          expect(res.body.postal_code).to.eql(testPolls[0].postal_code);

        });
    });

  });

});

  // When this value is added to the database
// ("b0439de8-fc14-4f39-922a-ce2ac6663a6b", "Seattle", NULL)

// And we query `GET /polls`

// We expect...
