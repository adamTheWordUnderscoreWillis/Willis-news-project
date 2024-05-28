const fs = require("fs/promises")

function fetchEndpoints() {
    return fs.readFile("endpoints.json", "UTF-8")
    .then((endpointsData)=> {
        return JSON.parse(endpointsData)
    })
}

module.exports = { fetchEndpoints }