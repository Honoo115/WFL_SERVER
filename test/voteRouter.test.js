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
    let testVotes = [
        {
            restaurant_id: 149359,
            poll_id: "b0439de8-fc14-4f39-922a-ce2ac6663a6b",
            user_ip: "9.19.39"
        }
    ]

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
        return db.raw("TRUNCATE polls RESTART IDENTITY CASCADE;");
    });

    // After every test
    afterEach(`clean up database`, () => {
        return db.raw("TRUNCATE polls RESTART IDENTITY CASCADE;");
    });

    describe("GET /results/:uuid", () => {

        beforeEach(`seed the database`, () => {

            return db.transaction(async trx => {
                // AK: These both need to be inserted into the database separately.
                await trx.into("polls").insert(testPolls);
                await trx.into("restaurants").insert(testRestaurant);
                await trx.into("votes").insert(testVotes);
            });

        });

        it(`responds with 200 with a winning restaurant with a votes property`,
            () => {
                let ourUUID = testVotes.poll_id;
                return supertest(app)
                    .get(`/votes/${ourUUID}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].poll_id).to.eql(testVotes.poll_id);
                        expect(res.body[0].restaurant_id).to.eql(testVotes.restaurant_id)
                        expect(res.body[0].user_ip).to.eql(testVotes.user_ip);
                    })
            })



    });
    describe("GET /options/:uuid", () => {

        beforeEach(`seed the database`, () => {

            return db.transaction(async trx => {
                // AK: These both need to be inserted into the database separately.
                await trx.into("polls").insert(testPolls);
                await trx.into("restaurants").insert(testRestaurant);
                await trx.into("votes").insert(testVotes);
            });

        });

        it(`responds with 200 with a list of restaurants`),
            () => {
                let ourUUID = testVotes.poll_id;
                return supertest(app)
                    .get(`/votes/${ourUUID}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].poll_id).to.eql(testVotes.poll_id);
                        expect(res.body[0].restaurant_id).to.eql(testVotes.restaurant_id)
                        expect(res.body[0].user_ip).to.eql(testVotes.user_ip);
                    })
            })



});
describe("POST /options/:uuid", () => {
    beforeEach(`seed the database`, () => {

        return db.transaction(async trx => {
            // AK: These both need to be inserted into the database separately.
            await trx.into("polls").insert(testPolls);
            await trx.into("restaurants").insert(testRestaurant);
            await trx.into("votes").insert(testVotes);
        });

    });
    it(`responds with 201 when a vote is cast`, () => {
        let newVote =
        {
            restaurant_id: 149359,
            poll_id: "b0439de8-fc14-4f39-922a-ce2ac6663a6b",
            user_ip: "9.19.39"
        };
        return supertest(app)
            .post(`/votes`)
            .send(newVote)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id');
                console.log(res)
            });
    })
})
});