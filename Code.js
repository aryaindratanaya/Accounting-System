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
  htmlServ.foods = getFoods();
  const html = htmlServ.evaluate().setWidth(1000).setHeight(1000);
  const ui = SpreadsheetApp.getUi();
  ui.showModelessDialog(html, "Cashier");
}

// Load entries from sheet
function getOrderId() {
  const ws = ss.getSheetByName("Sales");
  const entries = ws
    .getRange(getLastRowColumn(ws.getRange("B:B").getValues()), 2, 1, 2)
    .getValues();
  return arrayValidator(entries);
}

function getFoods() {
  const ws = ss.getSheetByName("Menu");
  const entries = ws
    .getRange(4, 3, getLastRowColumn(ws.getRange("C:C").getValues()) - 3, 2)
    .getValues();
  return arrayValidator(entries);
}

function getDrinks() {
  const ws = ss.getSheetByName("Menu");
  const entries = ws
    .getRange(4, 7, getLastRowColumn(ws.getRange("G:G").getValues()) - 3, 2)
    .getValues();
  return arrayValidator(entries);
}

// Add entries to sheet
function addSales(name, sltEatOptions, orders, date, time) {
  let salesEntry = [];
  const curOrderCount = isNaN(getOrderId()[0][0]) ? 1 : getOrderId()[0][0] + 1;
  const curOrderId = isNaN(getOrderId()[0][1]) ? 1 : getOrderId()[0][1] + 1;

  orders.forEach((order, i) => {
    const curFnB = Object.keys(order)[0];
    salesEntry.push([
      curOrderCount + i,
      curOrderId,
      curFnB,
      orders[i][curFnB].quantity,
      orders[i][curFnB].price,
      sltEatOptions,
      orders[i][curFnB].notes,
      date,
      time,
      name,
    ]);
  });

  const ws = ss.getSheetByName("Sales");
  ws.getRange(
    getLastRowColumn(ws.getRange("C:C").getValues()) + 1,
    2,
    salesEntry.length,
    10
  ).setValues([...salesEntry]);

  ws.getRange(
    getLastRowColumn(ws.getRange("L:L").getValues()) + 1,
    12,
    salesEntry.length,
    1
  ).insertCheckboxes();

  curOrderId % 2 === 0 &&
    setBackgroundColor(
      "Sales",
      getLastRowColumn(ws.getRange("C:C").getValues()) + 1 - salesEntry.length,
      2,
      salesEntry.length,
      11
    );
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

function setBackgroundColor(sheet, row1, col1, row2, col2) {
  const range = ss.getSheetByName(sheet).getRange(row1, col1, row2, col2);
  range.setBackgroundColor("#d9d9d9");
}
