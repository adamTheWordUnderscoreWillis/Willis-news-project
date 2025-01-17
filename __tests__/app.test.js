const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("News Api Tests", () => {
  describe("GET/API/TOPICS", () => {
    describe("Happy Path", () => {
      test("200: Returns Okay status Code", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("200: Returns an an array of topic objects with slug and description keys", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = body.topics;

            expect(topics).toHaveLength(3);
            expect(Array.isArray(topics)).toBe(true);

            topics.forEach((topic) => {
              expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          });
      });
    });
    describe("Sad Path", () => {
      test("404: Returns with an error message when the path is not found", () => {
        return request(app)
          .get("/api/not-a-route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Does not exist");
          });
      });
    });
  });
  describe("GET/API", () => {
    describe("Happy Path", () => {
      test("200: Returns an okay Status Code", () => {
        return request(app).get("/api").expect(200);
      });
      test("200: Returns an object all information about current endpoints", () => {
        const desiredFirstEndpoint = {
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        };
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            const endpoints = body.endpoints;
            endpointNamesArray = Object.keys(endpoints);
            expect(endpoints["GET /api/topics"]).toMatchObject(
              desiredFirstEndpoint
            );
            endpointNamesArray.forEach((endpoint) => {
              expect(endpoints[endpoint]).toHaveProperty("description");
              expect(endpoints[endpoint]).toHaveProperty("exampleResponse");
              expect(endpoints[endpoint]).toHaveProperty("queries");
            });
          });
      });
    });
    describe("Sad Path", () => {
      test("404: Returns with an error message when the path is not found", () => {
        return request(app)
          .get("/not-a-route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Does not exist");
          });
      });
    });
  });
  describe("GET/API/ARTICLES/:ARTICLE_ID", () => {
    describe("Happy Path", () => {
      test("200: Returns an okay Status Code", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      test("200: Returns the correct article", () => {
        const desiredArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        return request(app)
          .get("/api/articles/1")
          .expect(200)  
          .then(({ body }) => {
            const article = body.article;
            expect(article).toEqual(desiredArticle);
          });
      });
    });
    describe("Sad Path", () => {
      test("400: Returns an error message when request parametric endpoint is not number", () => {
        return request(app)
          .get("/api/articles/not-a-number")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Ah sorry, you can only input a number!");
          });
      });
      test("404: Returns an error message when the Id number does not exist", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article 999 does not exist.");
          });
      });
    });
  });
  describe("GET/API/ARTICLES", () => {
    describe("Happy Path", () => {
      test("200: Returns an okay Status Code", () => {
        return request(app).get("/api/articles").expect(200);
      });
      test("200: Returns all articles with correct key value pairs (except the comment count)", () => {
        const desiredArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11"
        }
        
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            const firstArticle = articles[0];
            const lastArticle = articles[12];

            expect(articles).toHaveLength(13);
            expect(lastArticle).toMatchObject(desiredArticle);

            articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
              });
            });
          });
      });
      test("200: Returns only articles related to a topic when queried",()=>{
        const CatsArticle = {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2"
            }
            return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            const firstArticle = articles[0];

            expect(articles).toHaveLength(1);
            expect(firstArticle).toMatchObject(CatsArticle);

            })
        });
      test("200: Returns an empty array when there category is valid but has no data",()=>{
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
      
            expect(articles).toHaveLength(0);
            })
        })
        test("200: Allows the user to sort by a specific criteria",()=>{
          const CatsArticle = {
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: "rogersop",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url:
              expect.any(String),
              comment_count: expect.any(String)
              }
              return request(app)
              .get("/api/articles?sort_by=author")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
              const firstArticle = articles[0];

              expect(firstArticle).toMatchObject(CatsArticle);
  
              })
          });
          test("200: Orders content in ascending order", () => {
            const desiredArticle = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: "11"
            }
            
            return request(app)
              .get("/api/articles?order=ASC")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                const firstArticle = articles[0];
                expect(firstArticle).toMatchObject(desiredArticle);
              });
          });
          test("200: Handles multiple requests", () => {
            const desiredArticle =  {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 100,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
              comment_count: '11'
            }
            
            return request(app)
              .get("/api/articles?sort_by=votes&order=ASC&topic=mitch")
              .expect(200)
              .then(({ body }) => {
                const { articles } = body;
                const lastArticle = articles[11];
                expect(lastArticle).toMatchObject(desiredArticle);
              });
          });
    });
    describe("Sad Path", ()=>{
      test("400: User has tried to query with invalid category", ()=>{
        return request(app)
          .get("/api/articles?nonCategory=cats")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("That query is not valid");
          });
      })
      test("400: User has tried to query with invalid parameter", ()=>{
        return request(app)
          .get("/api/articles?topic=NotTopic")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(`The Topic "NotTopic" is not one we cover I'm afraid.`);
          });
      })
      test("400: User has tried to sort by invalid option", ()=>{
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query");
          });
      })
      test("400: User has tried to order by invalid option", ()=>{
        return request(app)
          .get("/api/articles?order=OatFlatWhite")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      })

    })
  })
  describe("GET/API/ARTICLES/:ARTICLE_ID/COMMENTS", () => {
    describe("Happy Path", () => {
      test("200: Returns an okay Status Code", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
      test("200: Retrieves an empty array if no comments are made", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
            expect(comments.length).toBe(0);
          });
      });
      test("200: Retrieves an array of comments by article Id", () => {
        const desiredcomment = {
          comment_id: 5,
          body: "I hate streaming noses",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
        };
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments[0]).toEqual(desiredcomment);
            expect(comments.length).toBe(11);

            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: 1,
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              });
            });
          });
      });
    });
    describe("Sad Path", () => {
      test("400: Returns an error message when request parametric endpoint is not a number", () => {
        return request(app)
          .get("/api/articles/not-a-number/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Ah sorry, you can only input a number!");
          });
      });
      test("404: Returns an error message when the Id number does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article 999 does not exist.");
          });
      });
    });
  });
  describe("POST/API/ARTICLES/:ARTICLE_ID/COMMENTS", () => {
    describe("Happy Path", () => {
      test("201: Returns a Created Status Code", () => {
        const inputBody = {
            body: "My Spoon is too big!",
            username: "butter_bridge",
          };
        return request(app)
        .post("/api/articles/1/comments")
        .send(inputBody)
        .expect(201);
      });
      test("201: Inserts the comment into the database", () => {
        const inputBody = {
          body: "My Spoon is too big!",
          username: "butter_bridge",
        };
        const expectedResponseBody = {
          body: "My Spoon is too big!",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(inputBody)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toMatchObject(expectedResponseBody);
          });
      });
    });
    describe("Sad Path", () => {
      test("400: Returns an error message when request parametric endpoint is not a number", () => {
        const inputBody = {
          body: "My Spoon is too big!",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/not-a-number/comments")
          .send(inputBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Ah sorry, you can only input a number!");
          });
      });
      test("400: Returns an error message when the object body is malformed", () => {
        const inputBody = {
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(inputBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Sorry, but to perform this action on our comments, a body input is required!"
            );
          });
      });
      test("404: Returns an error message when the Id number does not exist", () => {
        const inputBody = {
          body: "My Spoon is too big!",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/999/comments")
          .send(inputBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("That is not allowed");
          });
      });
      test("400: Returns an error message when the username doesn't exist", () => {
        const inputBody = {
          body: "My Spoon is too big!",
          username: "notAUser",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(inputBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("That is not allowed");
          });
      });
    });
  });
  describe("PATCH/API/ARTICLES/:ARTICLE_ID",()=>{
    describe("Happy Path",()=>{
        test("201: Returns Created Status Code", () => {
            const newPatch = {inc_votes: 50};
            return request(app)
            .patch("/api/articles/2")
            .send(newPatch)
            .expect(201);
        })
        test("201: Increments the votes in the selected article", () => {
            const newPatch = {inc_votes: 1};
            const desiredArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              };
            return request(app)
              .patch("/api/articles/1")
              .send(newPatch)
              .expect(201)
              .then(({ body }) => {
                expect(body.article).toMatchObject(desiredArticle);
              });
          });
          test("201: Decrements the votes in the selected article", () => {
            const newPatch = {inc_votes: -20};
            const desiredArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 80,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              };
            return request(app)
              .patch("/api/articles/1")
              .send(newPatch)
              .expect(201)
              .then(({ body }) => {
                expect(body.article).toMatchObject(desiredArticle);
              });
          });
    })
    describe("Sad Path",()=>{
        test("400: Returns an error message when request parametric endpoint is not a number", () => {
            const newPatch = {inc_votes: 1};
            return request(app)
              .patch("/api/articles/not-a-number")
              .send(newPatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Ah sorry, you can only input a number!");
              });
          });
          test("400: Returns an error message when the object body is malformed", () => {
            const wrongPatch = {wrongKey: 1};
            return request(app)
              .patch("/api/articles/2")
              .send(wrongPatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe(
                  "Sorry, but to perform this action on our articles, a votes input is required!"
                );
              });
          });
          test("400: Returns an error message when the key is the wrong type", () => {
            const wrongTypePatch = {inc_votes: "word"};
            return request(app)
              .patch("/api/articles/2")
              .send(wrongTypePatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe(
                  "Ah sorry, you can only input a number!"
                );
              });
          });
          test("404: Returns an error message when the Id number does not exist", () => {
              const newPatch = {inc_votes: 1};
              return request(app)
              .patch("/api/articles/999")
              .send(newPatch)
              .expect(404)
              .then(({ body }) => {
                  expect(body.msg).toBe("Article 999 does not exist.");
                });
            });

        })
  })
  describe("DELETE/API/COMMENTS/:COMMENT_ID",()=>{
    describe("Happy Path",()=> {
        test("204: Returns No Content Status Code", () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({body})=>{
                expect(body).not.toContain(expect.anything())
            })
        })
        test("204: Deletes the correct comment", () => {
            const deletedComment = {
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                author: 'butter_bridge',
                votes: 16,
                created_at: '2020-04-06T12:17:00.000Z'
              }
            return request(app)
            .delete("/api/comments/1")
            .then(()=>{
                return request(app)
                .get("/api/articles/9/comments")
                .then(({ body }) => {
                    const { comments } = body;
                    comments.forEach((comment)=>{
                        expect(comment).not.toMatchObject(deletedComment)
                    })
                    expect(comments.length).toBe(1);
                });
            });
        });
    });
    describe("Sad Path",()=>{
        test("400: Returns an error message when request parametric endpoint is not a number", () => {
            return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Ah sorry, you can only input a number!");
            });
          });
          
        test("404: Returns an error message when the Id number does not exist", () => {
          return request(app)
              .delete("/api/comments/999")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Comment 999 does not exist.");
              });
          });
    })
  })
  describe("GET/API/USERS", () => {
    describe("Happy Path", () => {
      test("200: Returns an okay Status Code", () => {
        return request(app)
        .get("/api/users")
        .expect(200);
      });
      test("200: Returns all articles with correct key value pairs (except the comment count)", () => {
          const desiredUser = {
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          };
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;

            expect(users[0]).toEqual(desiredUser)
            expect(users).toHaveLength(4);

            users.forEach((article) => {
              expect(article).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
              });
            });
          });
      });
    });
  });

})
