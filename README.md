# bamazon

## bamazonCustomer.js

* When opened, a display of all products showing the sku, product name, department name, price, and quantity of each item.  Beneath the display, the user is prompted whether or not they want to buy a product

![bamazonCustomer results](/images/cust_products.png)

* If the user decides to buy a product, they select the product from the list of products.

![bamazonCustomer purchase](/images/cust_purchases.png)

* Once a product is selected, the user decides the quantity they want and then the total is displayed, which also updates the quantity in the original table.

![bamazonCustomer quantity](/images/cust_quantity.png)

## bamazonManager.js

* When opening the bamazonManager file, the user is presented with the following list of options:

![bamazonManager list](/images/man_list.png)

* Like the bamazonCustomer file, if the user selects "View Products for Sale", they see the same table listing all products and their subsequent details.

* Selecting "View Low Inventory" shows the user all products that have less than 5 items remaining.

![bamazonManager low](/images/man_low.png)

* When the user selects "Add to Inventory", the user selects the product from a list, inputs the quantity they want to add, and is presented a display informing them that the number they input were successfully added to the database.

![bamazonManager newInventory](/images/man_add.png)

* If the user selects "Add New Product", they will be prompted to add the name of the product, the name of the department, and the price.  Once those are entered, a string appears telling the user the product was successfully added.

![bamazonManager newProduct](/images/man_product.png)

## bamazonSupervisor.js

* When the user accesses the bamazonSupervisor file, they are presented with two options: 

1. "View Product Sales by Department"

* When selected, the subsequent table shows the department ID, department name, over head costs, product sales, and total cost.

![bamazonSupervisor table](/images/sup_table.png)

2. "Create New Department"

* When selected, the user is prompted to add a new department, which updates the options for the bamazonManager file as well.