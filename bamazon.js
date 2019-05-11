const inquirer = require('inquirer');
const mysql = require('mysql');
const {table} = require('table');
var data = [["sku", "Product", "Department", "Price", "Quantity"]];
var currentRow = [];
var output;

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon_db'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId);
    inquirer.prompt([
        {
            name: "products",
            message: "Would you like to see all available products?",
            type: "confirm"
        }
    ]).then(function(answers) {
        if (answers.products) {
            viewProduct()
            inquirer.prompt([
                {
                    name: "add",
                    message: "Would you like to add a product?",
                    type: "confirm"
                }
            ]).then(function(answers) {
                if (answers.add) {
                    inquirer.prompt([
                        {
                            name: 'product',
                            message: 'What is the name of the product?',
                            type: 'input'
                        },
                        {
                            name: 'department',
                            message: 'In which department does this product fall?',
                            type: 'input'
                        },
                        {
                            name: 'price',
                            message: 'How much does the product cost?',
                            type: 'input'
                        }
                    ])
                } else {
                    return
                }
            })
        } else {
            console.log("Fine.  I didn't want to show you anyways.");
            connection.end();
        }
    })
})

var viewProduct = () => {
    connection.query(`SELECT * FROM inventory;`, function(err, results) {
        for (let row of results) {
            currentRow = [];
            currentRow.push(row.sku);
            currentRow.push(row.productName);
            currentRow.push(row.departmentName);
            currentRow.push(row.price);
            currentRow.push(row.quantity);
            data.push(currentRow);
        }
        output = table(data);
        console.log(output);
        connection.end();
    })
};

var addProduct = () => {

};