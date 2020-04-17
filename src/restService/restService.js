const RestService = {
    addRestaurant(knex, restaurant) {
        return knex
            .insert(restaurant)
            .into('restaurants')
            .returning("*")
            .then(restaurant => {
                return restaurant[0]
            })
    },
    getRestaurants(knex, uuid) {
        return knex
            .select("*")
            .from("restaurants")
            .where("poll_id", uuid) 
    }
}
module.exports = RestService