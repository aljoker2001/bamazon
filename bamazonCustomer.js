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
    viewProduct()
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
        buyProduct();
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
                },
                {
                    name: "quantity",
                    message: "How many would you like to buy?",
                    type: "input"
                }
            ]).then(function (answers) {
                connection.query(`SELECT quantity, price, product_sales FROM inventory WHERE productName = "${answers.product}";`, function (err, results) {
                    if (err) throw err;
                    var sales = results[0].product_sales;
                    var oldQuantity = results[0].quantity;
                    var newQuantity = oldQuantity - answers.quantity;
                    var total = results[0].price * answers.quantity;
                    if (newQuantity >= 0) {
                        connection.query(`UPDATE inventory SET quantity = ${newQuantity} WHERE productName = "${answers.product}";`, function (err, results) {
                            if (err) throw err;
                            console.log(`Your total comes to $${total}.`);
                            connection.query(`UPDATE inventory SET product_sales = ${sales + total} WHERE productName = "${answers.product}";`, function(err, results) {
                                if (err) throw err;
                            })
                            connection.end();
                        })
                    } else {
                        console.log("There is not enough of that product in stock!");
                        connection.end();
                    }
                })
            })
        } else {
            connection.end();
        }
    })
}

var currentProducts = () => {
    connection.query('SELECT productName FROM inventory;', function (err, results) {
        if (err) throw err;
        for (let product of results) {
            products.push(product.productName);
        }
    })
}