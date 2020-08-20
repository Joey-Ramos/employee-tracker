const connection = require('../utils/connection');

class Query {
    // help to add roles
    deptsArray() {
		return connection
			.promise()
			.query(`SELECT department_name FROM departments`)
			.then(([ rows ]) => {
				rows.map((row) => row.department_name);
				rows = rows.map((row) => row.department_name);
				return rows;
			});
	}
    // help to add employee
    rolesArray() {
		return connection.promise().query(`SELECT title FROM roles`).then(([ rows ]) => {
			rows.map((row) => row.title);
			rows = rows.map((row) => row.title);
			return rows;
		});
    }
    // help to add employee
    employeesArray() {
		return connection
			.promise()
			.query(`SELECT CONCAT(first_name, ' ', last_name) AS fullName FROM employees`)
			.then(([ rows ]) => {
				rows.map((row) => row.fullName);
				rows = rows.map((row) => row.fullName);
				return rows;
			});
    }
    

    // view employee method
    viewEmployees() {
		return connection.promise().query(
			`SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        title, 
        department_name AS department,
        salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN employees m
        ON e.manager_id = m.id
      LEFT JOIN roles r 
        ON e.role_id = r.id
      LEFT JOIN departments d
        ON r.department_id = d.id`
		);
	}



    
    addRole({ title, salary, department }) {
		return connection.promise().query(`INSERT INTO roles 
       SET 
        title = ?, 
        salary = ?,
        department_id = (SELECT id FROM departments
                         WHERE department_name = ?)`, [ title, salary, department ]);
    }
    

    addEmployee({ firstName, lastName, title, manager }) {
		const managerNameArr = manager.split(' ');
		const managerFirstName = managerNameArr[0];
		const managerLastName = managerNameArr[1];

		return connection.promise().query(`INSERT INTO employees 
         SET  
          first_name = ?,
          last_name = ?,
          role_id = (SELECT id FROM roles 
                     WHERE title = ?),
          manager_id = (SELECT id FROM employees AS x
                        WHERE first_name = ? AND
                              last_name = ?)`, [
			firstName,
			lastName,
			title,
			managerFirstName,
			managerLastName
		]);
    }
    
    updateEmployeeRole({ employee, newRole }) {
		employee = employee.split(' ');
		const firstName = employee[0];
		const lastName = employee[1];
		return connection.promise().query(`UPDATE employees
         SET role_id = (SELECT id FROM roles
                        WHERE title = ?)
         WHERE (first_name = ? AND last_name = ?)`, [ newRole, firstName, lastName ]);
	}

	quit() {
		connection.end();
	}
};

module.exports = Query;