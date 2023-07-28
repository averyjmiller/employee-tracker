const express = require('express');
const init = require('./src/utils/index');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\n`);
  console.log(
`.--------------------------.
|                          |
|                          |
|                          |
|     EMPLOYEE MANAGER     |
|                          |
|                          |
|                          |
'--------------------------'`);
console.log(`\n`);
init();
});