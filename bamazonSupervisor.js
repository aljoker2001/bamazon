const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');
var data = [["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]];
var low = [["Product", "Quantity"]];
var lowRow = [];
var currentRow = [];
var output;
var products = [];
var departments = ["Add New Department"];
var quant;

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId);
    currentProducts();
    currentDepartments();
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

var viewSales = () => {

};

var newDept = () => {

};