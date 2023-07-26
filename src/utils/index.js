const inquirer = require('inquirer');
const db = require('../config/connection');

class Query {
  viewDepartments() {
    db.promise().query(`SELECT * FROM department`)
      .then(([rows, fields]) => {
        console.table(rows);
        prompt();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  viewRoles() {
    db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary 
                        FROM role 
                        JOIN department 
                        ON role.department_id = department.id;`)
      .then(([rows, fields]) => {
        console.table(rows);
        prompt();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  viewEmployees() {
    db.promise().query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary,
                          CONCAT(m.first_name, ' ', m.last_name) AS manager
                        FROM employee e
                        LEFT JOIN employee m
                        ON m.id = e.manager_id
                        JOIN role
                        ON e.role_id = role.id
                        JOIN department
                        ON role.department_id = department.id;`)
      .then(([rows, fields]) => {
        console.table(rows);
        prompt();
      })
      .catch((err) => {
        console.log(err);
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
    .then((res) => {
      db.promise().query(`INSERT INTO department (name)
                          VALUES (?)`, res.name)
        .then(() => {
          console.log(`Added ${res.name} to departments`);
          prompt();
        })
        .catch((err) => {
          console.log(err);
        });
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
      }
    ])
    .then((res) => {
      const resArr = [res.name, res.salary];
      db.promise().query(`SELECT id, name FROM department`)
        .then(([rows, fields]) => {
          const departmentsArr = rows.map(({ id, name }) => ({ name: name, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              message: 'Which department does the role belong to?',
              name: 'department',
              choices: departmentsArr
            }    
          ])
          .then((res) => {
            resArr.push(res.department);
            db.promise().query(`INSERT INTO role (title, salary, department_id)
                      VALUES (?, ?, ?)`, 
                      [resArr[0], resArr[1], resArr[2]])
              .then(() => {
                console.log(`Added ${resArr[0]} to roles`);
                prompt();
              })
              .catch((err) => {
                console.log(err);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
      }
    ])
    .then((res) => {
      const resArr = [res.first_name, res.last_name];
      db.promise().query(`SELECT id, title FROM role`)
        .then(([rows, fields]) => {
          const rolesArr = rows.map(({ id, title }) => ({ name: title, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              message: 'What is the employee\'s role?',
              name: 'role',
              choices: rolesArr
            }    
          ])
          .then((res) => {
            resArr.push(res.role);
            db.promise().query(`SELECT id, first_name, last_name FROM employee`)
              .then(([rows, fields]) => {
                const nullArr = [{ name: 'None', value: null }];
                const mappedArr = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                const managerArr = nullArr.concat(mappedArr);
                inquirer.prompt([
                  {
                    type: 'list',
                    message: 'Who is the employee\'s manager?',
                    name: 'manager',
                    choices: managerArr
                  }
                ])
                .then((res) => {
                  resArr.push(res.manager);
                  db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`, 
                            [resArr[0], resArr[1], resArr[2], resArr[3]])
                    .then(() => {
                      console.log(`Added ${resArr[0]} ${resArr[1]} to employees`);
                      prompt();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });  
              })
              .catch((err) => {
                console.log(err);
              });
          });  
        })
        .catch((err) => {
          console.log(err);
        });
      });
  }
  updateEmployeeRole() {
    db.promise().query(`SELECT id, first_name, last_name FROM employee`)
      .then(([rows, fields]) => {
        const employeeArr = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer.prompt([
          {
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            name: 'employee',
            choices: employeeArr
          }
        ])
        .then((res) => {
          const resArr = [res.employee];
          db.promise().query(`SELECT id, title FROM role`)
            .then(([rows, fields]) => {
              const rolesArr = rows.map(({ id, title }) => ({ name: title, value: id }));
              inquirer.prompt([
                {
                  type: 'list',
                  message: 'Which role do you want to assign the selected employee?',
                  name: 'role',
                  choices: rolesArr
                }    
              ])
              .then((res) => {
                resArr.push(res.role);
                db.promise().query(`SELECT id, first_name, last_name FROM employee`)
                  .then(([rows, fields]) => {
                    const nullArr = [{ name: 'None', value: null }];
                    const mappedArr = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                    const managerArr = nullArr.concat(mappedArr);
                    inquirer.prompt([
                      {
                        type: 'list',
                        message: 'Who is the employee\'s new manager?',
                        name: 'manager',
                        choices: managerArr
                      }
                    ])
                    .then((res) => {
                      resArr.push(res.manager);
                      db.promise().query(`UPDATE employee
                                          SET role_id = ?,
                                              manager_id = ?
                                          WHERE id = ?`, [resArr[1], resArr[2], resArr[0]])
                        .then(() => {
                          console.log(`Updated employee's role`);
                          prompt();
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    });  
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });  
            })
            .catch((err) => {
              console.log(err);
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
  .then((res) => {
    const query = new Query();
    switch(res.query) {
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