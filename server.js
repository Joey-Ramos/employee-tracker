const inquirer = require('inquirer');
const connection = require('./utils/connection');
const cTable = require('console.table');
const Query = require('./lib/Query');
const query = new Query();

// Menu options on start
const ownerOptions = () => {
    return inquirer.prompt([
        {
            type:'list',
            name: 'ownerOptions',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
        }
    ])
    .then(response => {
        switch (response.ownerOptions) {
            case 'View all Departments':
                viewAllDept();
                break;
            case 'View all Roles':
                viewAllRoles();
                break;
            case 'View all Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                promptAddRole();
                break;
            case 'Add an Employee':
                promptAddEmployee();
                break;
            case 'Update an Employee Role':
                promptUpdateEmp();
                break;
            default:
                connection.end();
        }
    });
};

// View all departments
viewAllDept = () => {
    connection.query(
        `SELECT * FROM departments`,
        function(err, res) {
            if (err) throw err;
            console.table(res);
            ownerOptions();
        }
    );
};

viewAllRoles = () => {
    // joining departments table to roles
    connection.query(
        `SELECT roles.id, title, salary, department_name  
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`,
        function(err, results) {
          if (err) throw err.message;
          console.table(results); 
          ownerOptions();
        }
    );
};

viewAllEmployees = () => {
    console.log('');
					query
						.viewEmployees()
						.then(([ row ]) => {
							console.table(row);
							ownerOptions();
						})
						.catch(console.log);
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepart',
            message: 'What is the name of the department you would like to add?',
            validate: addDepartInput => {
                if (addDepartInput) {
                    return true;
                } else {
                    console.log('Please enter your new department!');
                    return false;
                }
            }
        }
    ])
    // Add department to the table
    .then(response => {
            connection.query(
                'INSERT INTO departments SET department_name = ?',
                [
                    response.addDepart
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' added!\n');
                     // Return back to the original set of questions.
                    ownerOptions();
                }
            );
    })
};

const promptAddRole = () => {
    // generate department choices dynamically from db
      query.deptsArray().then((deptChoices) => {
          inquirer
              .prompt([
                  {
                      type    : 'input',
                      name    : 'title',
                      message : 'What is the name of the role you would like to add?'
                  },
                  {
                      type    : 'input',
                      name    : 'salary',
                      message : 'What is the salary for this role?'
                  },
                  {
                      type    : 'list',
                      name    : 'department',
                      message : 'Please select the department this role belongs to',
                      choices : deptChoices
                  }
              ])
              .then((roleObj) => {
                  query
                      .addRole(roleObj)
                      .then(() => {
                          console.log(
                            'New Role Added!'
                          );
                          ownerOptions();
                      })
                      .catch(console.log);
              });
      });
};

const promptAddEmployee = () => {
    // generate role and manager choices dynamically from db
      query.rolesArray().then((roleChoices) => {
          query.employeesArray().then((employeeChoices) => {
              inquirer
                  .prompt([
                      {
                          type    : 'input',
                          name    : 'firstName',
                          message : "What is the new employee's first name?"
                      },
                      {
                          type    : 'input',
                          name    : 'lastName',
                          message : "What is the employee's last name?"
                      },
                      {
                          type    : 'list',
                          name    : 'title',
                          message : "Select the employee's role",
                          choices : roleChoices
                      },
                      {
                          type    : 'list',
                          name    : 'manager',
                          message : "Select the employee's manager",
                          choices : employeeChoices
                      }
                  ])
                  .then((addEmpObj) => {
                      query
                          .addEmployee(addEmpObj)
                          .then(() => {
                              console.log(
                                  'New Employee Added!'
                              );
                              ownerOptions();
                          })
                          .catch(console.log);
                  });
          });
      });
};

const promptUpdateEmp = () => {
    // generate employee and role choices dynamically from db
      query.employeesArray().then((employeeChoices) => {
          query.rolesArray().then((roleChoices) => {
              inquirer
                  .prompt([
                      {
                          type    : 'list',
                          name    : 'employee',
                          message : 'Please select the employee to update',
                          choices : employeeChoices
                      },
                      {
                          type    : 'list',
                          name    : 'newRole',
                          message : "Please select the employee's new role",
                          choices : roleChoices
                      }
                  ])
                  .then((updateRoleObj) => {
                      query
                          .updateEmployeeRole(updateRoleObj)
                          .then(() => {
                              console.log(
                                  'Employee Role Updated!'
                              );
                              ownerOptions();
                          })
                          .catch(console.log);
                  });
          });
      });
  }

ownerOptions();