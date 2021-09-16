const knex = require('../db/connection.js')


async function read(){
    return knex('movies_theaters as mt')
                .join('movies as m', 'm.movie_id', 'mt.movie_id')
                .join('theaters as t', 't.theater_id', 'mt.theater_id')


}


module.exports = {
    read,
}