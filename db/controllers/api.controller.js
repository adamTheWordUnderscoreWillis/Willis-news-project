const { fetchAllEndpoints } = require("../models/api.models")

function getAllEndpoints(req,res, next){
    fetchAllEndpoints()
    .then((endpoints)=>{
        res.status(200).send({endpoints})
    })
}

module.exports = { getAllEndpoints }