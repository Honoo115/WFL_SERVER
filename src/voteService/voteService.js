const voteService = {
    getVotes(knex) {
        return knex.select("*").from("votes").where("poll_id", uuid)
    },
    addVote(knex, vote) {
        return knexx
            .insert(vote)
            .into('votes')
            .returning("*")
            .then(votes => {
                return votes[0]
            })
    }
}