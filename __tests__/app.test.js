const request = require("supertest");
const db = require("../db/connection");
const app = require("../db/app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed")

beforeAll(()=> seed(data));
afterAll(() => db.end());

describe("News Api Tests",()=>{
    describe("GET/API/TOPICS",()=>{
        describe("Happy Path",() => {
            test("200: Returns Okay status Code", ()=>{
                return request(app).get("/api/topics").expect(200);
            })
            test("200: Returns an an array of topic objects with slug and description keys", ()=>{
                return request(app).get("/api/topics").expect(200)
                .then(({ body }) => {
                    const topics = body.topics;
                    
                    expect(topics).toHaveLength(3);
                    expect(Array.isArray(topics)).toBe(true)
                    
                    topics.forEach((topic) =>{
                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)})
                        });
                    });
                });
            })
            describe("Sad Path",() => {
                test("404: Returns with an error message when the path is not found", ()=>{
                    return request(app)
                    .get("/api/not-a-route")
                    .expect(404)
                    .then(({body})=> {
                        expect(body.msg).toBe("Does not exist")
                    })
                });
            });
        });
    describe("GET/API", ()=>{
        describe("Happy Path", ()=>{
            test("200: Returns an okay Status Code", ()=>{
                return request(app)
                .get("/api")
                .expect(200);
            })
            test("200: Returns an object all information about current endpoints", ()=>{
                const desiredFirstEndpoint = {
                    "description": "serves an array of all topics",
                    "queries": [],
                    "exampleResponse": {
                      "topics": [{ "slug": "football", "description": "Footie!" }]
                    }
                }
                return request(app)
                .get("/api")
                .expect(200)
                .then(({body})=>{
                    const endpoints = body.endpoints
                    endpointNamesArray = Object.keys(endpoints)
                    expect(endpoints["GET /api/topics"]).toMatchObject(desiredFirstEndpoint)
                    endpointNamesArray.forEach((endpoint) =>{
                        expect(endpoints[endpoint]).toHaveProperty(
                            "description")
                        expect(endpoints[endpoint]).toHaveProperty(
                            "exampleResponse")
                        expect(endpoints[endpoint]).toHaveProperty(
                            "queries")
                    });
                })
            })
        })
        describe("Sad Path", ()=>{
            test("404: Returns with an error message when the path is not found", ()=>{
                return request(app)
                .get("/not-a-route")
                .expect(404)
                .then(({body})=> {
                    expect(body.msg).toBe("Does not exist")
                })
            });

        })
    })
})