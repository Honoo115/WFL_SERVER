const express = require("express");
const xss = require("xss");
const jsonParser = express.json();
const PollService = require('../pollService/pollService')
const pollRouter = express.Router()

pollRouter
    .route('/poll')
    .get((req, res, next) => {
        PollService.getPolls(req.app.get('db'))
            .then(polls => {
                res.json(polls)
            })
            .catch(next)
    })

module.exports = pollRouter