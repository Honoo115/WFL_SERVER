const PollService = {
    getPolls(knex) {
        return knex.select("*").from("polls")
    },
    getPoll(knex, uuid) {
        return knex
            .select("*")
            .from("polls")
            .where("uuid", uuid)
            .first();
    },
    addPoll(knex, poll) {
        return knex
            .insert(poll)
            .into('polls')
            .returning("*")
            .then(polls => {
                return polls[0]
            })
    }
}
module.exports = PollService