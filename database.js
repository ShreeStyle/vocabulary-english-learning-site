const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log("Error connecting to the database", err.message)
  } else {
    console.log("Connected to the SQLite database")
    createTables()
  }
})

function createTables() {
  const query = `
    CREATE TABLE IF NOT EXISTS users(
        id integer PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    `

  db.run(query, (err) => {
    if (err) {
      console.log("Error while creating table", err.message)
    } else {
      console.log("User table successfully created!")
    }
  })
}

module.exports = db
