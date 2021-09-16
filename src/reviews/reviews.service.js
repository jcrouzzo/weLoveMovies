const knex = require('../db/connection.js')

 
async function read(reviewId){
    return knex('reviews').select('*').where({'review_id' : reviewId}).first()
}
async function destroy(reviewId){
    return knex("reviews").where({ 'review_id':reviewId }).del();
}

async function update(reviewId,updatedReview) {
    // updates review and then return the updated review
    return knex("reviews as r")
      .where({ 'r.review_id': reviewId })
      .update(updatedReview)
      .then(()=> knex('reviews as r')
                .select('*')
                .where({'r.review_id': reviewId}).first());
  }


async function readCritic(criticId){
    return knex("critics")
            .select("*")
            .where({'critic_id': Number(criticId)})
            .first()
}

module.exports = {
    read,
    update,
    readCritic,
    delete:destroy,
}