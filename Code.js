const ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen() {
  createMenu();
}

function createMenu() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Start");
  menu.addItem("Cashier", "loadCashier");
  menu.addToUi();
}

// Functions below display the pages
function loadCashier() {
  const htmlServ = HtmlService.createTemplateFromFile("Cashier");
  htmlServ.drinks = getDrinks();
  const html = htmlServ.evaluate().setWidth(1000).setHeight(1000);
  const ui = SpreadsheetApp.getUi();
  ui.showModelessDialog(html, "Cashier");
}

// Load entries from sheet
function getDrinks() {
  const ws = ss.getSheetByName("Menu");
  const entries = ws
    .getRange(4, 7, getLastRowColumn(ws.getRange("F:F").getValues()) - 3, 2)
    .getValues();
  return arrayValidator(entries);
}

// Add entries to sheet
function addSales(id, sltEatOptions, orders, notes) {
  let salesEntry = [];

  orders.forEach((order, i) => {
    const currentFnB = Object.keys(order)[0];
    salesEntry.push([
      currentFnB,
      orders[i][currentFnB].quantity,
      orders[i][currentFnB].price,
      sltEatOptions,
      notes,
    ]);
  });

  const ws = ss.getSheetByName("Sales");
  ws.getRange(
    getLastRowColumn(ws.getRange("B:B").getValues()) + 1,
    2,
    1,
    4
  ).setValues([[1, id, sltEatOptions, notes]]);
}

// Repeated operations
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function arrayValidator(anyArray) {
  anyArray.map((r) => r[0]);
  return anyArray;
}

function getLastRowColumn(range) {
  var rowNum = 0;
  var blank = false;
  for (var row = 0; row < range.length; row++) {
    if (range[row][0] === "" && !blank) {
      rowNum = row;
      blank = true;
    } else if (range[row][0] !== "") {
      blank = false;
    }
  }
  return rowNum;
}
