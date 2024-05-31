# Northcoders News API

Hello there! It's me potential, future big money hire Adam Willis. This is my news app. Come in make yourself at home!

If you'd like to have a play around with this hot new API in your browser, you can access it here:

    https://adam-willis-cool-news-hub.onrender.com/

## What is it?
This news app allows the user to make SQL queries on articles database. It includes GET requests for the articles, their comments, topics and users; it allows for posting and deleting comments and it can patch the votes on an article, to increment its value.

I hope you like it!


## Instructions to get the code from GitHub

### Cloning the repo
1. The first thing you will need to do is visit my Github and go to the Willis-news-project repo, please:
     https://github.com/adamTheWordUnderscoreWillis/Willis-news-project

2. You'll see a tantilising green button with the word code, written alluringly on it. Give it a little click.
3. You should now see a url. Copy it, please.
4. Open the terminal on your desktop and navigate to whatever folder you want this API to call its new home (It's so tough to watch them grow up...)
5. type in the command "git clone" followed by the url. This will intitate the API on your machine.
6. Open it up in whatever IDE you use.

### Setup

#### Dependencies
You will need to do is install the dependencies listed in the package.json file (I installed mine through the npm package manager, which can be done simply by typing "npm install" and then the dependency you need in the terminal).

#### Seeding
Please note that for the seeding to work the files env.test and env.develoment need to be created in the root folder, in order for npm dotenv to allocate the correct database to the right client in regards to testing and devlopment locally.

To do this:
1. Copy the .env-expmple provided two times
2. Replace the suffix with .test and .development respectively
3. Edit the name of the database after the equals to be nc_news (env.development) and nc_news_test (env.test)
4. Run Npm run setup-dbs in the terminal
5. Run Npm run seed in the terminal
6. Please ensure that the env files are included in your .gitignore (found in root folder)
7. Make yourself a tea!

#### Running Tests
The test suite provided was uses the following Dev dependencies, so if you wish to run tests please install the following in your terminal by writing "npm install -D" followed by these packages:

    husky
    jest
    jest-extended
    jest-sorted
    supertest

Once that is done you can run the test suite with the terminal command "npm test"

#### Minimum Requirements
Please note that the following packages minimum versions required to run the API:

    node.js version 21
    postgres version 6.4

# Have fun!
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
