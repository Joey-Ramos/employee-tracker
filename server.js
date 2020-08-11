const inquirer = require('inquirer');

const ownerOptions = () => {
    return inquirer.prompt([
        {
            type:'list',
            name: 'View',
            message: 'What would you like to view?',
            choices: ['View all Departments', 'View all roles', 'Veiw all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ])
    .then()
}

// console.log(
//     logo({
//         name: 'Employee Database!',c
//         logoColor: 'orange',
//         borderColor: 'blue'
//     }).render()
// );

ownerOptions();