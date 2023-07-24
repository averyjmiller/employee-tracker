const inquirer = require('inquirer');
const Query = require('./db');

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
        query.viewDepartments();
        break;
      case "View all roles":
        query.viewRoles();
        break;
      case "View all employees":
        query.viewEmployees();
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
        });
        break;
      case "Add a role":
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'name'
          },
          {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary'
          },
          {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'department',
            choices: getDepartmentsArr()
          }
        ])
        .then((answer) => {
          db.query(`INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`, 
                    [answer.name, answer.salary, parseInt(answer.department)]);
          console.log(`Added ${answer.name} to roles`);
        });
        break;
      case "Add an employee":
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'first_name'
          },
          {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'last_name'
          },
          {
            type: 'list',
            message: 'What is the employee\'s role?',
            name: 'role',
            choices: getRolesArr()
          },
          {
            type: 'list',
            message: 'Who is the employee\'s manager?',
            name: 'manager',
            choices: getEmployeesArr()
          }
        ])
        .then((answer) => {
          let manager_id;
          if(answer.manager) {
            manager_id = parseInt(answer.manager);
          } else {
            manager_id = answer.manager;
          }
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`, 
                    [answer.first_name, answer.last_name, parseInt(answer.role), manager_id]);
          console.log(`Added ${answer.first_name} ${answer.last_name} to employees`);
        });
        break;
      case "Update an employee role":
        console.log("Updating an employee role");
        break;
      default:
        console.log(`Switch case error`);
        break;
    }
  })
  .then(() => {
    init();
  });
}

function getDepartmentsArr() {
  const arr = [];
  db.query(`SELECT * FROM department`, (err, rows) => {
    let i = 0;
    rows.forEach((row) => {
      arr[i] = { name: row.name, value: row.id.toString() };
      i++;
    });
  });
  return arr;
}

function getRolesArr() {
  const arr = [];
  db.query(`SELECT * FROM role`, (err, rows) => {
    let i = 0;
    rows.forEach((row) => {
      arr[i] = { name: row.title, value: row.id.toString() };
      i++;
    });
  });
  return arr;
}

function getEmployeesArr() {
  const arr = [{ name: 'None', value: null }];
  db.query(`SELECT * FROM employee`, (err, rows) => {
    let i = 1;
    rows.forEach((row) => {
      arr[i] = { name: `${row.first_name} ${row.last_name}`, value: row.id.toString() };
      i++;
    });
  });
  return arr;
}

module.exports = init;