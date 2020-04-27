const voteService = {
    getVotes(knex, uuid) {
        return knex.select("*").from("votes")
        .join("restaurants","votes.restaurant_id", "restaurants.id")
        .where("votes.poll_id", uuid)
    },
    addVote(db, voteToAdd) {
        return (
            db
                .insert(voteToAdd)
                .into('votes')
                .returning('*')
                .then(([vote]) => vote)
                .then(vote => {
                    return vote;
                })
        );
    }
}
module.exports = voteService