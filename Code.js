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
function addSales(id, sltEatOptions, orders, date, time) {
  let salesEntry = [];
  const curOrderId = isNaN(getOrderId()[0][0]) ? 1 : getOrderId()[0][0] + 1;
  // const curRow = getLastRowColumn(ws.getRange("B:B").getValues()) + 1;

  orders.forEach((order, i) => {
    const curFnB = Object.keys(order)[0];
    salesEntry.push([
      curOrderId + i,
      id,
      curFnB,
      orders[i][curFnB].quantity,
      orders[i][curFnB].price,
      sltEatOptions,
      orders[i][curFnB].notes,
      date,
      time,
    ]);
  });

  const ws = ss.getSheetByName("Sales");
  ws.getRange(
    getLastRowColumn(ws.getRange("C:C").getValues()) + 1,
    2,
    salesEntry.length,
    9
  ).setValues([...salesEntry]);
  // setBackgroundColor("Sales", curRow, 2, salesEntry.length, 9);
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
  range.setBackgroundColor("grey");
}
