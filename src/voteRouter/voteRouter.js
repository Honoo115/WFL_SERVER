const express = require("express");
const xss = require("xss");
const jsonParser = express.json();
const voteService = require('../voteService/voteService')
const voteRouter = express.Router()
voteRouter
    .route('/options/:uuid')
    .get((req, res, next) => {
        voteService.getVotes(
            req.app.get('db'),
            req.params.uuid
        )
            .then(votes => {
                res.json(votes)
            })
            .catch(next)
    })
module.exports = voteRouter