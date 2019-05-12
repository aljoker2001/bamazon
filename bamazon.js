const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');
var data = [["sku", "Product", "Department", "Price", "Quantity"]];
var currentRow = [];
var output;
var products = [];

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
    inquirer.prompt([
        {
            name: "products",
            message: "Would you like to see all available products?",
            type: "confirm"
        }
    ]).then(function (answers) {
        if (answers.products) {
            viewProduct();
        } else {
            addProduct();
            buyProduct();
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
        addProduct();
    })
};

var addProduct = () => {
    inquirer.prompt([
        {
            name: "add",
            message: "Would you like to add a product?",
            type: "confirm"
        }
    ]).then(function (answers) {
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
            ]).then(function (answers) {
                connection.query(`INSERT INTO inventory (productName, departmentName, price) VALUES ("${answers.product}", "${answers.department}", ${answers.price});`, function (err, results) {
                    if (err) throw err;
                })
                console.log(`${answers.product} has been added to the inventory.`);
                connection.end();
            })
        } else {
            buyProduct();
        }
    })
};

var buyProduct = () => {
    inquirer.prompt([
        {
            name: "purchase",
            message: "Would you like to buy a product?",
            type: "confirm"
        }
    ]).then(function (answers) {
        if (answers.purchase) {
            inquirer.prompt([
                {
                    name: "product",
                    message: "What would you like to buy?",
                    type: "list",
                    choices: products
                }
            ]).then(function (answers) {
                connection.query(`SELECT quantity FROM inventory WHERE productName = "${answers.product}";`, function(err, results) {
                    if (err) throw err;
                    var oldQuantity = results[0].quantity;
                    var newQuantity = oldQuantity - 1;
                    connection.query(`UPDATE inventory SET quantity = ${newQuantity} WHERE productName = "${answers.product}";`, function(err, results) {
                        if (err) throw err;
                        connection.end();
                    })
                })
            })
        } else {
            connection.end();
        }
    })
}

var currentProducts = () => {
    connection.query('SELECT productName FROM inventory;', function(err, results) {
        if (err) throw err;
        for (let product of results) {
            products.push(product.productName);
        }
    })
}