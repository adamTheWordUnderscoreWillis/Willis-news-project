const { fetchEndpoints } = require("../models/api.models")

function getEndpoints(req,res, next){
    fetchEndpoints()
    .then((endpoints)=>{
        res.status(200).send({endpoints})
    })
}

module.exports = { getEndpoints }