class Query {
  displayDepartments(rows) {
    console.log("\nid | name");
    console.log("-----------");
    rows.forEach((row) => {
      console.log(`${row.id} ${row.name}`);
    });
    console.log('\n');
  }
  displayRoles(rows) {
    console.log("\nid | title | department | salary");
    console.log("---------------------------");
    rows.forEach((row) => {
      console.log(`${row.id} ${row.title} ${row.name} ${row.salary}`);
    });
    console.log('\n');
  }
  displayEmployees(rows) {
    console.log("\nid | first_name | last_name | title | department | salary | manager");
    console.log("---------------------------");
    rows.forEach((row) => {
      console.log(`${row.id} ${row.first_name} ${row.last_name} ${row.title} ${row.name} ${row.salary} ${row.manager}`);
    });
    console.log('\n');
  }
}

module.exports = Query;