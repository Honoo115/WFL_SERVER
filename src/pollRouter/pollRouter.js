const express = require("express");
const xss = require("xss");
const jsonParser = express.json();
const PollService = require('../pollService/pollService')
const pollRouter = express.Router()
const fetch = require('node-fetch');
const RestService = require('../restService/restService')
const openTableApi = "http://opentable.herokuapp.com/api/restaurants?";
const { v4: uuidv4 } = require('uuid');

pollRouter
    .route('/poll')
    .get((req, res, next) => {

        PollService.getPolls(req.app.get('db'))
            .then(polls => {
                res.json(polls)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        ("IP ADDRESS HERE ----->", req.ip)
        let restaurants = [];

        let { city, postal_code, uuid } = req.body; // Grab the uuid
        if (postal_code === '') {
            postal_code = 0
        }
        const newPoll = { city, postal_code, uuid }; // SHOULD MATCH UP WITH THE DATABASE

        PollService.addPoll(req.app.get('db'), newPoll)
            .then(poll => {
                const openTableApi = "http://opentable.herokuapp.com/api/restaurants?";
                let searchStr = '';
                if (city) searchStr = "city=" + city;
                if (postal_code) searchStr = "zip=" + postal_code; // This is the only zip you'll ever see
                fetch(openTableApi + searchStr)
                    .then(rez => rez.json())
                    .then(resJson => {
                        resJson.restaurants.forEach(restaurant => {
                            restaurant.poll_id = uuid
                            RestService.addRestaurant(req.app.get('db'), restaurant);
                        })
                    })
                return res.json(poll)
            })
            .catch(next)
    })

pollRouter
    .route('/poll/:uuid')
    .get((req, res, next) => {
        PollService.getPoll(req.app.get('db'), req.params.uuid)
            .then(poll => {
                res.json(poll)
            })
            .catch(next)
    });


module.exports = pollRouter;
