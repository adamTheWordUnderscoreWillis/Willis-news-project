const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../db/app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(() => seed(data));
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
            expect(body.msg).toBe("The article id must be an integer");
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
        };
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
  describe("GET/API/ARTICLES/:ARTICLE_ID/comments", () => {
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
            expect(body.msg).toBe("The article id must be an integer");
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
      test("200: Returns an okay Status Code", () => {
        const inputBody = {
            body: "My Spoon is too big!",
            username: "butter_bridge",
          };
        return request(app)
        .post("/api/articles/1/comments")
        .send(inputBody)
        .expect(200);
      });
      test("200: Inserts the comment into the database", () => {
        const inputBody = {
          body: "My Spoon is too big!",
          username: "butter_bridge",
        };
        const expectedResponseBody = {
          comment_id: 20,
          body: "My Spoon is too big!",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(inputBody)
          .expect(200)
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
            expect(body.msg).toBe("The article id must be an integer");
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
              "When inputing comments you must include a body"
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
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article 999 does not exist.");
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
            expect(body.msg).toBe("The username notAUser does not exist.");
          });
      });
    });
  });
})
