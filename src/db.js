const knex = require("knex");
const knexfile = require("../knexfile");
const db = knex(knexfile);

console.log(knexfile);

module.exports = db;
