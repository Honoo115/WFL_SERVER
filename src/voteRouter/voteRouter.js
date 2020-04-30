const express = require("express");
const xss = require("xss");
const jsonParser = express.json();
const voteService = require('../voteService/voteService')
const voteRouter = express.Router()
voteRouter
    .route('/votes/:uuid')
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
    .post(jsonParser, (req, res) => {
        const { restaurant_id, poll_id } = req.body
        voteService.getIP(req.app.get('db'), poll_id, req.ip)
            .then(userIp => {
                if (userIp.length > 0) {
                    console.log("USER ALEREADY VOTED", userIp)
                    res.json({ msg: "You have already voted, click OK to redirect to current standings" })
                }
                else {
                    const newVote = { restaurant_id, poll_id }
                    newVote.user_ip = req.ip
                    voteService.addVote(req.app.get('db'), newVote)
                        .then(vote => {
                            res
                                .status(201)
                                .json(vote)
                        })
                }
            })

    })
module.exports = voteRouter