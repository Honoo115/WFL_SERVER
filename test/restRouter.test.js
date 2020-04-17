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
  let testRestaurant = 
  {
    id: 149359,
    poll_id: "b0439de8-fc14-4f39-922a-ce2ac6663a6b",
    name: "Farrelli's Wood Fire Pizza-Frederickson",
    address: "5612 176th St, Ste E",
    city: "Puyallup",
    state: "WA",
    area: "Seattle / Eastern Washington",
    postal_code: "98375",
    country: "US",
    phone: "2536555191",
    lat: 47.096306,
    lng: -122.355918,
    price: 2,
    reserve_url: "http://www.opentable.com/single.aspx?rid=149359",
    mobile_reserve_url: "http://mobile.opentable.com/opentable/?restId=149359",
    image_url: "https://www.opentable.com/img/restimages/149359.jpg"
  }

  // This runs before any tests
  before(`connect to db`, () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  // This runs after everything is done
  // AK: I would recommend keeping the after, before, beforeach etc at the top
  after(`disconnect from db`, () => {
    return db.destroy();
  });

  // Before any test runs, clean the database
  before(`clean up database`, () => {
    return db.raw("TRUNCATE restaurants RESTART IDENTITY CASCADE;");
  });

  // After every test
  afterEach(`clean up database`, () => {
    return db.raw("TRUNCATE restaurants RESTART IDENTITY CASCADE;");
  });

  describe("GET /restaurant/:uuid", () => {
    beforeEach(`seed the database`, () => {

      return db.transaction(async trx => {
        // AK: These both need to be inserted into the database separately.
        await trx.into("polls").insert(testPolls);
        await trx.into("restaurants").insert(testRestaurant);
      });

    });

    it(`Responds with 200 with an restaurant object`, () => {
      let ourUUID = testRestaurant.poll_id;
      return supertest(app)
        .get(`/restaurants/${ourUUID}`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].poll_id).to.eql(testRestaurant.poll_id);
          expect(res.body[0].city).to.eql(testRestaurant.city);
          expect(res.body[0].postal_code).to.eql(testRestaurant.postal_code);

        });
    });

  });

});
