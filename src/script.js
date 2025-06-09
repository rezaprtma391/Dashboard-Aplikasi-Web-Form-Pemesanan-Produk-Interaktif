    const TOKEN = 'nfp_BTua2XpNFkjP8gPY9EdimYmkkWYLpesJ8811'; // Ganti dengan token kamu
    const FORM_ID = '68470bf0f9d9890008823279'; // Ganti dengan ID form kamu

    async function fetchFormSubmissions() {
      const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`;
      const response = await fetch(url, {
        headers: {
          'Authorization': TOKEN
        }
      });
      return await response.json();
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

    fetchFormSubmissions().then(data => renderTable(data)).catch(err => {
      document.getElementById('loading').innerText = 'Gagal memuat data.';
      console.error(err);
    });