const TOKEN = 'nfp_BTua2XpNFkjP8gPY9EdimYmkkWYLpesJ8811'; // Token API kamu
const SITE_ID = '60148b9e-7c19-4283-a2c6-7749155a7074'; // Ganti dengan Site ID dari Netlify
const FORM_NAME = 'pemesanan-produk'; // Ganti sesuai dengan atribut name di form HTML

async function getFormIdByName(siteId, formName) {
  const url = `https://api.netlify.com/api/v1/sites/${siteId}/forms`;
  const response = await fetch(url, {
    headers: {
      'Authorization': TOKEN
    }
  });
  const forms = await response.json();
  const form = forms.find(f => f.name === formName);
  if (!form) throw new Error('Form dengan nama tersebut tidak ditemukan.');
  return form.id;
}

async function fetchFormSubmissions() {
  try {
    const formId = await getFormIdByName(SITE_ID, FORM_NAME);
    const url = `https://api.netlify.com/api/v1/forms/${formId}/submissions`;
    const response = await fetch(url, {
      headers: {
        'Authorization': TOKEN
      }
    });
    const data = await response.json();
    renderTable(data);
  } catch (err) {
    document.getElementById('loading').innerText = 'Gagal memuat data.';
    console.error(err);
  }
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.data.nama || ''}</td>
      <td>${entry.data.email || ''}</td>
      <td>${entry.data.produk || ''}</td>
      <td>${entry.data.catatan || ''}</td>
    `;
    tbody.appendChild(row);
  });
  document.getElementById('loading').style.display = 'none';
  document.getElementById('dataTable').style.display = 'table';
}

function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

let sortDir = true;

function sortTable(colIndex) {
  const rows = Array.from(document.querySelectorAll("#tableBody tr"));
  rows.sort((a, b) => {
    const aText = a.children[colIndex].textContent.trim().toLowerCase();
    const bText = b.children[colIndex].textContent.trim().toLowerCase();
    return sortDir ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });
  sortDir = !sortDir;
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

document.getElementById("searchInput").addEventListener("input", filterTable);

// Jalankan
fetchFormSubmissions();
