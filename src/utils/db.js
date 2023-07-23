const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'ci1on3f5O_8Lbrlwrore',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

module.exports = db;