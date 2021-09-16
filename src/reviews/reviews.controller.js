const service = require('./reviews.service')
const asyncErrorBoundary =  require('../errors/asyncErrorBoundary')

//middleware and validation functions

async function reviewExists(req, res, next){
    const review = await service.read(req.params.reviewId)
    if(!!review){
        res.locals.review = review;
        return next();
    }else{
        return next({status:404, message:`Review cannot be found: ${req.params.reviewId}`})
    }
}

const validFields = ['review_id', 'content', 'score', 'critic_id', 'movie_id']

function hasValidFields(req, res, next) {
    const { data } = res.locals.review;
    try{
    if(data){
        const invalidFields = Object.keys(data).filter(
        (field) => !validFields.has(field)
        );
    
        if (invalidFields.length){
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
        }
    } else {
        return next()
    }
    return next({status: 400, message:'Data must be provided for update in form {data: {updatedfield:updatedvalue, ...}}'})
}catch(e){console.errror(e)}
  }

  
//CRUD functions 


async function update(req, res){
    const resp = await service.update(req.params.reviewId, req.body.data)
    const critic = await service.readCritic(resp.critic_id)
    const data={...resp, critic}
    console.log(data)
    return res.json({data})
}



async function destroy(req, res){
    const reviewId = req.params.reviewId;
    service.delete(reviewId)
    return res.sendStatus(204)
}

module.exports = {
    delete:[asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update:[asyncErrorBoundary(reviewExists), hasValidFields, asyncErrorBoundary(update)],

}