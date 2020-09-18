const db = require("../database/dbConfig");

function find() {
  return db("users");
}

function add(user) {
  return db("users")
    .insert(user)
    .then(([id]) => {
      return findBy({ id });
    });
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}

module.exports = { find, add, findBy };
