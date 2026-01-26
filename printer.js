// ===== Global Variables =====
let printerData = [];
let printerEditId = null;

// Get element
const printerModule = document.getElementById("printerModule");

// Create HTML content
printerModule.innerHTML = `
  <h2>Printer Inventory</h2>

  <button onclick="openPrinterForm()">➕ Add Printer</button>
  <button onclick="exportPrinterExcel()">📊 Export Printer Excel</button>

  <form id="printerForm" class="hidden">
    <input id="printBrand" placeholder="Brand" required>
    <input id="printModel" placeholder="Model" required>
    <input id="printSerial" placeholder="Serial Number" required>
    <input id="printDept" placeholder="Department" required>
    <input id="printDivision" placeholder="Division" required>
    <input id="printStatus" placeholder="Status" required>

    <button type="submit">Save</button>
    <button type="button" onclick="closePrinterForm()">Cancel</button>
  </form>

  <table>
    <thead>
      <tr>
        <th>Brand</th>
        <th>Model</th>
        <th>Serial Number</th>
        <th>Department</th>
        <th>Division</th>
        <th>Status</th>
        <th>Date Created</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="printerTable"></tbody>
  </table>
`;

// ===== Form & Fields =====
const printerForm = document.getElementById("printerForm");
const printBrand = document.getElementById("printBrand");
const printModel = document.getElementById("printModel");
const printSerial = document.getElementById("printSerial");
const printDept = document.getElementById("printDept");
const printDivision = document.getElementById("printDivision");
const printStatus = document.getElementById("printStatus");
const printerTable = document.getElementById("printerTable");

// ===== Navigation =====
function showPrinter() {
  welcomeText.style.display = "none";
  cpuModule.classList.add("hidden");
  projectorModule.classList.add("hidden");
  printerModule.classList.remove("hidden");
}

// ===== Form controls =====
function openPrinterForm() {
  printerForm.classList.remove("hidden");
}

function closePrinterForm() {
  printerForm.classList.add("hidden");
  printerForm.reset();
}

// ===== Firestore Listener =====
db.collection("printers")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    printerData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPrinters();
  });

// ===== Add / Update =====
function addPrinter(e) {
  e.preventDefault();

  db.collection("printers").add({
    brand: printBrand.value,
    model: printModel.value,
    serial: printSerial.value,
    dept: printDept.value,
    division: printDivision.value,
    status: printStatus.value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  closePrinterForm();
}

function updatePrinter(e) {
  e.preventDefault();

  db.collection("printers").doc(printerEditId).update({
    brand: printBrand.value,
    model: printModel.value,
    serial: printSerial.value,
    dept: printDept.value,
    division: printDivision.value,
    status: printStatus.value
  });

  printerEditId = null;
  printerForm.onsubmit = addPrinter;
  closePrinterForm();
}

printerForm.onsubmit = addPrinter;

// ===== Render Table =====
function renderPrinters() {
  printerTable.innerHTML = "";
  printerData.forEach((p, index) => {
    printerTable.innerHTML += `
      <tr>
        <td>${p.brand}</td>
        <td>${p.model}</td>
        <td>${p.serial}</td>
        <td>${p.dept}</td>
        <td>${p.division}</td>
        <td>${p.status}</td>
        <td>${p.createdAt ? p.createdAt.toDate().toLocaleString() : ""}</td>
        <td>
          <button onclick="editPrinter(${index})">✏️ Edit</button>
          <button onclick="deletePrinter(${index})">🗑️ Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== Edit / Delete =====
function editPrinter(index) {
  const p = printerData[index];
  printerEditId = p.id;

  openPrinterForm();

  printBrand.value = p.brand;
  printModel.value = p.model;
  printSerial.value = p.serial;
  printDept.value = p.dept;
  printDivision.value = p.division;
  printStatus.value = p.status;

  printerForm.onsubmit = updatePrinter;
}

function deletePrinter(index) {
  if (confirm("Are you sure you want to delete this Printer?")) {
    db.collection("printers").doc(printerData[index].id).delete();
  }
}

// ===== Export to Excel =====
function exportPrinterExcel() {
  if (printerData.length === 0) {
    alert("No Printer data to export!");
    return;
  }

  let excelData = [[
    "Brand",
    "Model",
    "Serial Number",
    "Department",
    "Division",
    "Status",
    "Date Created"
  ]];

  printerData.forEach(p => {
    excelData.push([
      p.brand,
      p.model,
      p.serial,
      p.dept,
      p.division,
      p.status,
      p.createdAt ? p.createdAt.toDate().toLocaleString() : ""
    ]);
  });

  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.aoa_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "Printer Inventory");
  XLSX.writeFile(wb, "Printer_Inventory_Report.xlsx");
}
