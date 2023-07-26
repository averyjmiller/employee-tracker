const inquirer = require('inquirer');
const db = require('../config/connection');

class Query {
  viewDepartments() {
    db.query(`SELECT * FROM department`, (err, rows) => {
      console.table(rows);
      prompt();
    });
  }
  viewRoles() {
    db.query(`SELECT role.id, role.title, department.name, role.salary 
              FROM role 
              JOIN department 
              ON role.department_id = department.id;`, (err, rows) => {
      console.table(rows);
      prompt();
    });
  }
  viewEmployees() {
    db.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
              FROM employee e
              LEFT JOIN employee m
              ON m.id = e.manager_id
              JOIN role
              ON e.role_id = role.id
              JOIN department
              ON role.department_id = department.id;`, (err, rows) => {
      console.table(rows);
      prompt();
    });
  }
  addDepartment() {
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
      prompt();
    });
  }
  addRole() {
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
        choices: this.#getDepartmentsArr()
      }
    ])
    .then((answer) => {
      db.query(`INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`, 
                [answer.name, answer.salary, parseInt(answer.department)]);
      console.log(`Added ${answer.name} to roles`);
      prompt();
    });
  }
  addEmployee() {
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
        choices: this.#getRolesArr()
      },
      {
        type: 'list',
        message: 'Who is the employee\'s manager?',
        name: 'manager',
        choices: this.#getEmployeesArr()
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
      prompt();
    });
  }
  updateEmployeeRole() {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, rows) => {
      const employeeArr = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
      inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee\'s role do you want to update?',
          name: 'employee',
          choices: employeeArr
        }
      ])
      .then((answer) => {
        const answerArr = [answer.employee];
        db.query(`SELECT id, title FROM role`, (err, rows) => {
          const rolesArr = rows.map(({ id, title }) => ({ name: title, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              message: 'Which role do you want to assign the selected employee?',
              name: 'role',
              choices: rolesArr
            }    
          ])
          .then((answer) => {
            answerArr.push(answer.role);
            db.query(`UPDATE employee
                      SET role_id = ?
                      WHERE id = ?`, [answerArr[1], answerArr[0]], (err, rows) => {
              console.table(rows);
              prompt();
            });
          });
        });
      });
    });
  }
  #getDepartmentsArr() {
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
  #getRolesArr() {
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
  #getEmployeesArr() {
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
}

const prompt = () => {
  inquirer.prompt([
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
        query.addDepartment();
        break;
      case "Add a role":
        query.addRole();
        break;
      case "Add an employee":
        query.addEmployee();
        break;
      case "Update an employee role":
        query.updateEmployeeRole();
        break;
      default:
        console.log(`Switch case error`);
        break;
    }
  });
}

module.exports = prompt;