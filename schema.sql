DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE IF NOT EXISTS bamazon_db;

USE bamazon_db;

DROP TABLE IF EXISTS inventory;
CREATE TABLE IF NOT EXISTS inventory (
	sku INT(10) AUTO_INCREMENT,
    productName VARCHAR(255) NOT NULL,
    departmentName VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT(10) DEFAULT 200,
    PRIMARY KEY (sku)
    );
    
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Nintendo Switch", "Video Games", 199.99);
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Champion Sweatshirt", "Clothing", 24.99);  
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Dog Toy", "Pet", 5.99);  
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Purple Crocs", "Clothing", 19.99);  
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Kylo Ren Lightsaber", "Toy", 199.99); 
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Mortal Kombat 11", "Video Games", 59.99); 
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Spatula", "Home Goods", 7.99); 
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Lavender-scented Candle", "Home Goods", 12.99); 
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Playstation 4", "Video Games", 249.99); 
INSERT INTO inventory (productName, departmentName, price)
VALUES ("Barbeque Grill", "Outdoor", 149.99);  

SELECT * FROM inventory;