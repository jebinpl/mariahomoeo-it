// ===== Global Variables =====
let projectorData = [];
let projectorEditId = null;

// Get elements
const projectorModule = document.getElementById("projectorModule");

// Create HTML content for projector module
projectorModule.innerHTML = `
  <h2>Projector Inventory</h2>

  <button onclick="openProjectorForm()">➕ Add Projector</button>
  <button onclick="exportProjectorExcel()">📊 Export Projector Excel</button>

  <form id="projectorForm" class="hidden">
    <input id="projBrand" placeholder="Brand" required>
    <input id="projSerial" placeholder="Serial Number" required>
    <input id="projModel" placeholder="Model" required>
    <input id="projDept" placeholder="Department" required>
    <input id="projStatus" placeholder="Status" required>

    <button type="submit">Save</button>
    <button type="button" onclick="closeProjectorForm()">Cancel</button>
  </form>

  <table>
    <thead>
      <tr>
        <th>Brand</th>
        <th>Serial Number</th>
        <th>Model</th>
        <th>Department</th>
        <th>Status</th>
        <th>Date Created</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="projectorTable"></tbody>
  </table>
`;

// ===== Form & Fields =====
const projectorForm = document.getElementById("projectorForm");
const projBrand = document.getElementById("projBrand");
const projSerial = document.getElementById("projSerial");
const projModel = document.getElementById("projModel");
const projDept = document.getElementById("projDept");
const projStatus = document.getElementById("projStatus");
const projectorTable = document.getElementById("projectorTable");

// ===== Functions =====
/*function showProjector() {
  welcomeText.style.display = "none";
  cpuModule.classList.add("hidden");
  projectorModule.classList.remove("hidden");
}*/

function openProjectorForm() {
  projectorForm.classList.remove("hidden");
}

function closeProjectorForm() {
  projectorForm.classList.add("hidden");
  projectorForm.reset();
}

// ===== Firestore Listener =====
db.collection("projectors")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    projectorData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderProjectors();
  });

// ===== Add / Update =====
function addProjector(e) {
  e.preventDefault();

  db.collection("projectors").add({
    brand: projBrand.value,
    serial: projSerial.value,
    model: projModel.value,
    dept: projDept.value,
    status: projStatus.value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  closeProjectorForm();
}

function updateProjector(e) {
  e.preventDefault();

  db.collection("projectors").doc(projectorEditId).update({
    brand: projBrand.value,
    serial: projSerial.value,
    model: projModel.value,
    dept: projDept.value,
    status: projStatus.value
  });

  projectorEditId = null;
  closeProjectorForm();
  projectorForm.onsubmit = addProjector;
}

projectorForm.onsubmit = addProjector;

// ===== Render Table =====
function renderProjectors() {
  projectorTable.innerHTML = "";
  projectorData.forEach((p, index) => {
    projectorTable.innerHTML += `
      <tr>
        <td>${p.brand}</td>
        <td>${p.serial}</td>
        <td>${p.model}</td>
        <td>${p.dept}</td>
        <td>${p.status}</td>
        <td>${p.createdAt ? p.createdAt.toDate().toLocaleString() : ""}</td>
        <td>
          <button onclick="editProjector(${index})">✏️ Edit</button>
          <button onclick="deleteProjector(${index})">🗑️ Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== Edit / Delete =====
function editProjector(index) {
  const proj = projectorData[index];
  projectorEditId = proj.id;

  openProjectorForm();

  projBrand.value = proj.brand;
  projSerial.value = proj.serial;
  projModel.value = proj.model;
  projDept.value = proj.dept;
  projStatus.value = proj.status;

  projectorForm.onsubmit = updateProjector;
}

function deleteProjector(index) {
  if (confirm("Are you sure you want to delete this Projector?")) {
    db.collection("projectors").doc(projectorData[index].id).delete();
  }
}

// ===== Export to Excel =====
function exportProjectorExcel() {
  if (projectorData.length === 0) {
    alert("No Projector data to export!");
    return;
  }

  let excelData = [["Brand","Serial Number","Model","Department","Status","Date Created"]];
  projectorData.forEach(p => {
    excelData.push([
      p.brand,
      p.serial,
      p.model,
      p.dept,
      p.status,
      p.createdAt ? p.createdAt.toDate().toLocaleString() : ""
    ]);
  });

  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.aoa_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "Projector Inventory");
  XLSX.writeFile(wb, "Projector_Inventory_Report.xlsx");
}

