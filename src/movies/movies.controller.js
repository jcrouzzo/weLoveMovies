const service = require('./movies.service')
const asyncErrorBoundary =  require('../errors/asyncErrorBoundary')

//Middleware and validation functions

async function movieExists(req, res, next){
    const movieId = req.params.movieId
    const foundMovie = await service.read(movieId)
    if(foundMovie){
        res.locals.movie = foundMovie
        return next()
    }else{
        return next({status:404, message:'Movie not found'})
    } 
}
//CRUD functions

async function list(req, res){
    let data = {}
    if(req.query){
    const { is_showing } = req.query
    data = await service.list(is_showing)
    }else {
        data= await service.list()
    }
    return res.json({data})
}

async function read(req, res){
    return res.json({data: res.locals.movie})
}

async function read_theaters(req, res){
    const movieId =res.locals.movie.movie_id;
    const data = await service.read_theaters(movieId)
    return res.json({data})
}

async function read_reviews(req, res){
    const movieId = res.locals.movie.movie_id
    let data = await service.read_reviews(movieId)
    data=data.map((review) =>{
             return {
            review_id:review.review_id,
            content:review.content,
            score:review.score,
            movie_id:review.movie_id,
            title:review.title,
            runtime_in_minutes:review.runtime_in_minutes,
            rating:review.rating,
            description:review.description,
            image_url:review.image_url,
	    critic:{
            preferred_name:review.preferred_name,
            surname:review.surname,
            organization_name:review.organization_name
		}
    }  
    })
    return res.json({data})
}
module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    read_theaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read_theaters)],
    read_reviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read_reviews)]
}  