const knex = require('../db/connection.js')


async function list(isShowing = false){
    if(isShowing){
        const resp = await knex('movies as m')
        .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
        .where({'mt.is_showing': true})
        .groupBy('m.movie_id')
        ;
        return resp
    }else{
        return knex('movies as m');
    }
    
}

function read(movieId){
    return knex('movies').select('*').where({'movie_id':movieId}).first()
}

function read_theaters(movieId){
    return knex('movies_theaters as mt')
            .join('theaters as t', 'mt.theater_id', 't.theater_id')
            .select('*')
            .where({'mt.movie_id':movieId})
        }

function read_reviews(movieId){
    return knex('reviews as r')
            .join('movies as m', 'r.movie_id', 'm.movie_id')
            .join('critics as c', 'r.critic_id', 'c.critic_id')
            .select('*')
            .where({'m.movie_id':movieId})
}
module.exports = {
    list,
    read,
    read_theaters,
    read_reviews
}