let currentPage = 1;
const rowsPerPage = 5;
let customers = []; // Aquí deberías obtener los datos reales (por ejemplo, desde una API)

function renderRows(data) {
    const tableBody = document.querySelector("#customer-grid tbody");
    tableBody.innerHTML = ""; // Limpiar filas existentes

    if (data.length === 0) {
        const tr = document.createElement("tr");
        tr.classList.add("no-results");
        tr.innerHTML = "<td colspan='6'>No hay resultados</td>";
        tableBody.appendChild(tr);
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.first_name}</td>
            <td>${row.last_name}</td>
            <td>${row.email}</td>
            <td>${row.gender}</td>
            <td>${row.country}</td>
            <td>${row.ip_address}</td>
        `;
        tableBody.appendChild(tr);
    });

    updatePageInfo();
}

function updatePageInfo() {
    const pageInfo = document.querySelector("#page-info");
    const totalPages = Math.ceil(customers.length / rowsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    document.querySelector("#prev-page").disabled = currentPage === 1;
    document.querySelector("#next-page").disabled = currentPage === totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(customers.length / rowsPerPage);
    if (direction === "prev" && currentPage > 1) {
        currentPage--;
    } else if (direction === "next" && currentPage < totalPages) {
        currentPage++;
    }

    renderRows(customers);
}

document.querySelector("#prev-page").addEventListener("click", () => changePage("prev"));
document.querySelector("#next-page").addEventListener("click", () => changePage("next"));

document.querySelector("#nameFilter").addEventListener("input", filterTable);
document.querySelector("#emailFilter").addEventListener("input", filterTable);

function filterTable() {
    const nameFilter = document.querySelector("#nameFilter").value.toLowerCase();
    const emailFilter = document.querySelector("#emailFilter").value.toLowerCase();

    const filteredCustomers = customers.filter(customer => 
        customer.first_name.toLowerCase().includes(nameFilter) &&
        customer.email.toLowerCase().includes(emailFilter)
    );

    renderRows(filteredCustomers);
}

function sortTable(column) {
    const th = document.getElementById(`sort-${column}`);
    const currentSort = th.classList.contains("asc") ? "asc" : "desc";
    
    customers.sort((a, b) => {
        if (currentSort === "asc") {
            return a[column] > b[column] ? 1 : -1;
        } else {
            return a[column] < b[column] ? 1 : -1;
        }
    });

    th.classList.toggle("asc", currentSort === "desc");
    th.classList.toggle("desc", currentSort === "asc");

    renderRows(customers);
}

document.querySelectorAll(".sortable").forEach(th => {
    th.addEventListener("click", () => sortTable(th.id.split('-')[1]));
});

// Supón que los datos se cargan aquí
fetch('http://localhost:3000')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        customers = data;
        renderRows(customers);
    })
    .catch(error => {
        console.error('Error fetching customers:', error);
    });

