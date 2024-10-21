
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

const dataFilePath = path.join(__dirname, 'budget.json');


const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (error) {
    return [];
  }
};

const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

program
  .command('add')
  .description('Add a new budget item')
  .option('-t, --title <title>', 'Title of the budget item')
  .option('-q, --quantity <quantity>', 'Quantity of the item', parseInt)
  .option('-p, --unitprice <unitprice>', 'Price per quantity', parseFloat)
  .action((options) => {
    const budgetItems = loadData();
    const newItem = {
      title: options.title,
      quantity: options.quantity,
      unitprice: options.unitprice,
    };
    budgetItems.push(newItem);
    saveData(budgetItems);
    console.log('Item added:', newItem);
  });

// Update item command
program
  .command('update')
  .description('Update an existing budget item')
  .option('-t, --title <title>', 'Title of the budget item')
  .option('-q, --quantity <quantity>', 'New quantity of the item', parseInt)
  .option('-p, --unitprice <unitprice>', 'New price per quantity', parseFloat)
  .action((options) => {
    const budgetItems = loadData();
    const item = budgetItems.find((item) => item.title === options.title);

    if (!item) {
      return console.log('Item not found');
    }

    if (options.quantity) item.quantity = options.quantity;
    if (options.unitprice) item.unitprice = options.unitprice;

    saveData(budgetItems);
    console.log('Item updated:', item);
  });


program
  .command('get')
  .description('Get a specific budget item')
  .option('-t, --title <title>', 'Title of the budget item')
  .action((options) => {
    const budgetItems = loadData();
    const item = budgetItems.find((item) => item.title === options.title);

    if (!item) {
      return console.log('Item not found');
    }

    console.log('Item:', item);
  });

// Get all items command
program
  .command('getall')
  .description('Get all budget items')
  .action(() => {
    const budgetItems = loadData();
    console.log('All items:', budgetItems);
  });


program
  .command('delete')
  .description('Delete a budget item')
  .option('-t, --title <title>', 'Title of the budget item')
  .action((options) => {
    let budgetItems = loadData();
    const itemIndex = budgetItems.findIndex((item) => item.title === options.title);

    if (itemIndex === -1) {
      return console.log('Item not found');
    }

    budgetItems.splice(itemIndex, 1);
    saveData(budgetItems);
    console.log(`Item '${options.title}' deleted`);
  });

program.parse(process.argv);
