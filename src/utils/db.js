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

class Query {
  viewDepartments() {
    db
    .promise()
    .query(`SELECT * FROM department`)
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    });
  }
  viewRoles() {
    db
    .promise()
    .query(`SELECT role.id, role.title, department.name, role.salary 
            FROM role 
            JOIN department 
            ON role.department_id = department.id;`)
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    });
  }
  viewEmployees() {
    db
    .promise()
    .query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary,
              CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m
            ON m.id = e.manager_id
            JOIN role
            ON e.role_id = role.id
            JOIN department
            ON role.department_id = department.id;`)
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
    });
  }
}

module.exports = Query;