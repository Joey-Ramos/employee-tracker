const inquirer = require('inquirer');
const connection = require('./utils/connection');

// Menu options on start
const ownerOptions = () => {
    return inquirer.prompt([
        {
            type:'list',
            name: 'Options',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all roles', 'Veiw all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
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
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
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

// console.log(
//     logo({
//         name: 'Employee Database!',c
//         logoColor: 'orange',
//         borderColor: 'blue'
//     }).render()
// );

ownerOptions();