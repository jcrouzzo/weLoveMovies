const service = require('./theaters.service')
const asyncErrorBoundary =  require('../errors/asyncErrorBoundary')


async function read(req, res, next){
    const resp = await service.read()
    const data = resp.reduce((acc, movie) => {
       const index= acc.findIndex((entry) => entry.name===movie.name)
    if(index===-1){
        acc.push({
            name: movie.name,
            address_line_1: movie.address_line_1,
            address_line_2: movie.address_line_2,
            city: movie.city,
            state: movie.state,
            zip: movie.zip,
            
            movies:[
            { 
            title: movie.title,
            runtime_in_minutes: movie.runtime_in_minutes,
            rating: movie.rating,
        }
                ]
                    })
    }else{
        acc[index].movies.push({       
            title: movie.title,
            runtime_in_minutes: movie.runtime_in_minutes,
            rating: movie.rating,
                }
              )
        }
        return acc
    }, [])
    return res.json({data})
}

module.exports = {
    read,
}