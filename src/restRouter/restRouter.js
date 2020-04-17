const express = require("express");
const xss = require("xss");
const RestService = require('../restService/restService')
const { v4: uuidv4 } = require('uuid');
const restRouter = express.Router()


restRouter
    .route('/restaurants/:uuid')
    .get((req, res, next) => {
        RestService.getRestaurants(
            req.app.get('db'),
            req.params.uuid
        )
            .then(restaurants => {
                res.json(restaurants)
            })
            .catch(next)
    })
module.exports = restRouter;