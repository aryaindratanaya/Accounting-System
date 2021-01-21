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
function addSales(id, sltEatOptions, orders) {
  const now = new Date();
  let salesEntry = [];

  orders.forEach((order, i) => {
    const currentFnB = Object.keys(order)[0];
    salesEntry.push([
      id,
      currentFnB,
      orders[i][currentFnB].quantity,
      orders[i][currentFnB].price,
      sltEatOptions,
      orders[i][currentFnB].notes,
      now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear(),
      ,
    ]);
  });

  const ws = ss.getSheetByName("Sales");
  ws.getRange(
    getLastRowColumn(ws.getRange("C:C").getValues()) + 1,
    3,
    salesEntry.length,
    8
  ).setValues([...salesEntry]);
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
