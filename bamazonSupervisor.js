const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');
const _ = require('lodash');
var data = [["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]];
var currentRow = [];
var output;

// creates connection to the bamazon_db database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon_db'
});

// provides the user with two options, then runs the specific function based on their answer
connection.connect(function (err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId);
    inquirer.prompt([
        {
            name: "options",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (answers) {
        switch (answers.options) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                newDept();
                break;
        }
    })
})

// displays a table of all of the required pieces of data once run
var viewSales = () => {
    connection.query(`SELECT DISTINCT departments.department_id, departments.department_name, departments.over_head_costs, inventory.product_sales, inventory.product_sales - departments.over_head_costs AS total_sales
    FROM inventory
    RIGHT JOIN departments ON inventory.departmentName = departments.department_name
    GROUP BY departments.department_id ORDER BY departments.department_id;`, function (err, results) {
            if (err) throw err;
            for (let row of results) {
                currentRow = [];
                currentRow.push(row.department_id);
                currentRow.push(row.department_name);
                currentRow.push(row.over_head_costs);
                currentRow.push(row.product_sales);
                currentRow.push(row.total_sales);
                data.push(currentRow);
            }
            output = table(data);
            console.log(output);
        })
    connection.end();
};

// prompts the user to enter the department name and over head cost, then updates the database with the new information
var newDept = () => {
    inquirer.prompt([
        {
            name: "department",
            message: "Please enter department name:",
            type: "input"
        },
        {
            name: "overhead",
            message: "Please enter over head cost:",
            type: "input",
            validate: function(input) {
                if (isNaN(input) === true) {
                    return "You must enter a number.";
                }
                return true;
            }
        }
    ]).then(function(answers) {
        connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ("${answers.department}", "${answers.overhead}");`, function(err, results) {
            if (err) throw err;
        })
        connection.end();
    })
};