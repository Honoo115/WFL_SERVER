const voteService = {
    getVotes(knex, uuid) {
        return knex.select('*').from("votes")
            .where("votes.poll_id", uuid)
    },
    getIP(knex, uuid, ip) {
        return knex.select('*').from("votes")
            .where("votes.poll_id", uuid)
            .andWhere("votes.user_ip", ip)
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