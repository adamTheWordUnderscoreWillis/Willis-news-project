# Northcoders News API

Please note that for the seeding to work the files env.test and env.develoment need to be created in the root folder, in order for npm dotenv to allocate the correct database to the right client in regards to testing and devlopment locally.

To do this:
1. Copy the .env-expmple provided two times
2. Replace the suffix with .test and .development respectively
3. Edit the name of the database after the equals to be nc_news (env.development) and nc_news_test (env.test)
4. Run Npm run setup-dbs in the terminal
5. Run Npm run seed in the terminal
6. Please ensure that the env files are included in your .gitignore (found in root folder)
7. Make yourself a tea, have fun with the database!
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
