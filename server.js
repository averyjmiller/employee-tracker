const express = require('express');
const mysql = require('mysql2');
const init = require('./src/utils/prompt');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'ci1on3f5O_8Lbrlwrore',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

init();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
