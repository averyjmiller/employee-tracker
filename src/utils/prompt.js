const inquirer = require('inquirer');
const db = require('./db');
const Query = require('./query');

function init() {
  inquirer
  .prompt([
    {
      type: "list",
      message: "",
      name: "query",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit"
      ]
    }
  ])
  .then((answer) => {
    const query = new Query();
    switch(answer.query) {
      case "View all departments":
        console.log("Viewing all departments");
        db.query(query.display('department'), function(err, results) {
          console.log(results);
          init();
        });
        break;
      case "View all roles":
        console.log("Viewing all roles");
        db.query(query.display('role'), function(err, results) {
          console.log(results);
          init();
        });
        break;
      case "View all employees":
        console.log("Viewing all employees");
        db.query(query.display('employee'), function(err, results) {
          console.log(results);
          init();
        });
        break;
      case "Add a department":
        console.log("Adding a department");
        break;
      case "Add a role":
        console.log("Adding a role");
        break;
      case "Add an employee":
        console.log("Adding an employee");
        break;
      case "Update an employee role":
        console.log("Updating an employee role");
        break;
      case "Quit":
        break;
      default:
        console.log(`Switch case error`);
        break;
    }
  });
}

module.exports = init;