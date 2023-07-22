const inquire = require('inquirer');
const Query = require('./query');

function init() {
  inquire
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
      ]
    }
  ])
  .then((answer) => {
    const query = new Query();
    switch(answer.query) {
      case "View all departments":
        console.log("Viewing all departments");
        break;
      case "View all roles":
        console.log("Viewing all roles");
        break;
      case "View all employees":
        console.log("Viewing all employees");
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
      default:
        console.log(`Switch case error`);
        break;
    }
  });
}

module.exports = init;