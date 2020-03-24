cp .env.sample .env
createdb bookstore-api
npm install
knex migrate:latest
knex seed:run
