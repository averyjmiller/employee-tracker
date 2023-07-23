const inquirer = require('inquirer');
const db = require('./db');
const Query = require('./query');

function init() {
  inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "query",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role"
      ]
    }
  ])
  .then((answer) => {
    const query = new Query();
    switch(answer.query) {
      case "View all departments":
        db.query(`SELECT * FROM department`, function(err, rows) {
          query.displayDepartments(rows);
          init();
        });
        break;
      case "View all roles":
        db.query(`SELECT role.id, role.title, department.name, role.salary 
                  FROM role 
                  JOIN department 
                  ON role.department_id = department.id;`, function(err, rows) {
          query.displayRoles(rows);
          init();
        });
        break;
      case "View all employees":
        console.log("Viewing all employees");
        db.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary,
                    CONCAT(m.first_name, ' ', m.last_name) AS manager
                  FROM employee e
                  LEFT JOIN employee m
                  ON m.id = e.manager_id
                  JOIN role
                  ON e.role_id = role.id
                  JOIN department
                  ON role.department_id = department.id;`, function(err, rows) {
          query.displayEmployees(rows)          
          init();
        });
        break;
      case "Add a department":
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'name'
          }
        ])
        .then((answer) => {
          db.query(`INSERT INTO department (name)
                    VALUES (?)`, answer.name);
          console.log(`Added ${answer.name} to departments`);
          init();
        });
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