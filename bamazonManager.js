const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');
var data = [["sku", "Product", "Department", "Price", "Quantity"]];
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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answers) {
        switch (answers.options) {
            case "View Products for Sale":
                viewProduct();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        }
    })
})

var viewProduct = () => {
    connection.query(`SELECT * FROM inventory;`, function (err, results) {
        if (err) throw error;
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
    inquirer.prompt([
        {
            name: 'product',
            message: 'What is the name of the product?',
            type: 'input'
        },
        {
            name: 'department',
            message: 'In which department does this product fall?',
            type: 'list',
            choices: departments
        },
        {
            when: function (response) {
                return response.department === "Add New Department";
            },
            name: 'newDept',
            message: 'What is the name of the department?',
            type: 'input'
        },
        {
            name: 'price',
            message: 'How much does the product cost?',
            type: 'input'
        }
    ]).then(function (answers) {
        if (answers.newDept) {
            connection.query(`INSERT INTO inventory (productName, departmentName, price) VALUES ("${answers.product}", "${answers.newDept}", ${answers.price});`, function (err, results) {
                if (err) throw err;
            })
            console.log(`${answers.product} has been added to the inventory.`);
            connection.end();
        } else {
            connection.query(`INSERT INTO inventory (productName, departmentName, price) VALUES ("${answers.product}", "${answers.department}", ${answers.price});`, function (err, results) {
                if (err) throw err;
            })
            console.log(`${answers.product} has been added to the inventory.`);
            connection.end();
        }
    })
};

var lowInventory = () => {
    connection.query(`SELECT productName, quantity FROM inventory WHERE quantity < 5;`, function (err, results) {
        if (err) throw err;
        for (let product of results) {
            lowRow = [product.productName, product.quantity];
            low.push(lowRow);
        }
        output = table(low);
        console.log(output);
        connection.end();
    })
}

var addInventory = () => {
    inquirer.prompt([
        {
            name: "product",
            message: "What product would you like to add?",
            type: "list",
            choices: products
        },
        {
            name: "quantity",
            message: "How many would you like to add?",
            type: "number"
        }
    ]).then(function (answers) {
        connection.query(`SELECT quantity FROM inventory WHERE productName = "${answers.product}";`, function (err, results) {
            if (err) throw err;
            quant = parseInt(results[0].quantity);
            connection.query(`UPDATE inventory SET quantity = ${quant + parseInt(answers.quantity)} WHERE productName = "${answers.product}";`, function (err, results) {
                if (err) throw err;
                console.log(`${answers.quantity} were added successfully to ${answers.product}.`);
            })
            connection.end();
        })
    })
};

var currentProducts = () => {
    connection.query('SELECT productName FROM inventory;', function (err, results) {
        if (err) throw err;
        for (let product of results) {
            products.push(product.productName);
        }
    })
}

var currentDepartments = () => {
    connection.query('SELECT department_name FROM departments;', function (err, results) {
        if (err) throw err;
        for (let department of results) {
            if (!departments.includes(department.department_name)) {
                departments.push(department.department_name);
            }
        }
    })
}