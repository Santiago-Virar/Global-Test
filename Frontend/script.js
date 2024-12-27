let currentPage = 1;
const rowsPerPage = 5;
let customers = [];
let customerFilter = [];

function renderRows(data) {
    const tableBody = document.querySelector("#customer-grid tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No hay resultados</td></tr>`;
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach((customer, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${customer.first_name}</td>
            <td>${customer.last_name}</td>
            <td>${customer.email}</td>
            <td>${customer.gender}</td>
            <td>${customer.country}</td>
            <td>${customer.ip_address}</td>
            <td>
                <button class="delete-btn" data-index="${customer.id}">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="update-btn" data-index="${customer.id}">
                    <i class="bi bi-gear"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    updatePageInfo();
    addDeleteEventListeners(); 
    addUpdateEventListeners()
}

function updatePageInfo(customersArray = customerFilter, page = currentPage) {
    const pageInfo = document.querySelector("#page-info");
    const totalPages = Math.ceil(customersArray.length / rowsPerPage);
    pageInfo.textContent = `Página ${page} de ${totalPages}`;
    document.querySelector("#prev-page").disabled = page === 1;
    document.querySelector("#next-page").disabled = page === totalPages;
}

document.querySelector("#prev-page").addEventListener("click", () => {
    if (currentPage > 1) currentPage--;
    renderRows(customerFilter);
});
document.querySelector("#next-page").addEventListener("click", () => {
    if (currentPage < Math.ceil(customerFilter.length / rowsPerPage)) currentPage++;
    renderRows(customerFilter);
});

document.getElementById("add-customer-btn").addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.getElementById("modal-title").textContent = "Agregar Cliente"; 
    document.getElementById("customer-form").reset(); 
});

document.querySelector("#nameFilter").addEventListener("input", filterTable);
document.querySelector("#emailFilter").addEventListener("input", filterTable);

function filterTable() {
    const nameFilter = document.querySelector("#nameFilter").value.toLowerCase();
    const emailFilter = document.querySelector("#emailFilter").value.toLowerCase();
    if(!nameFilter.length && !emailFilter.length) {
        customerFilter = customers
        updatePageInfo(customers)
        renderRows(customers);
        return
    }
    else {
        customerFilter = customers.filter(customer =>
            customer.first_name.toLowerCase().includes(nameFilter) &&
            customer.email.toLowerCase().includes(emailFilter)
        );
        currentPage = 1;
        updatePageInfo(customerFilter)
        renderRows(customerFilter);
        return
    }
}

const modal = document.getElementById("customer-modal");
document.getElementById("add-customer-btn").addEventListener("click", () => {
    modal.classList.remove("hidden");
});

document.getElementById("close-modal-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
});


const modal2 = document.getElementById("customer-modal-update");
document.getElementById("close-modal-btn-update").addEventListener("click", () => {
    modal2.classList.add("hidden");
});




document.getElementById("customer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newCustomer = {
        first_name: document.getElementById("first-name").value,
        last_name: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
        country: document.getElementById("country").value,
        ip_address: document.getElementById("ip-address").value,
    };

    fetch("http://localhost:3000/customer", {
        method:"post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer) 
    }).then(resp => resp.json())
    .then(res => {
        if (res.status === 201) {
            modal.classList.add("hidden");

            getCustomers()
            showToast("Cliente creado con exito")
        }else {
            showToast(res.message)
        }
    })
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function addDeleteEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.removeEventListener("click", deleteCustomerHandler); 
        btn.addEventListener("click", deleteCustomerHandler); 
    });
}



function deleteCustomerHandler(e) {
    e.stopPropagation(); 
    e.preventDefault();
    const index = e.currentTarget.dataset.index;
    const confirmModal = document.getElementById("confirm-delete-modal");
    confirmModal.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirm-delete-btn");
    const cancelBtn = document.getElementById("cancel-delete-btn");

    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    const newConfirmBtn = document.getElementById("confirm-delete-btn");

    newConfirmBtn.addEventListener("click", (r) => {
        r.preventDefault();
        fetch(`http://localhost:3000/customer/${index}`, {
            method:"delete",
        }).then(resp => resp.json())
        .then(res => {
            if (res.status === 200) {
                modal.classList.add("hidden");
    
                getCustomers()
                confirmModal.classList.add("hidden");
                showToast("Cliente eliminado con exito")
            }else {
                showToast(res.message)
            }
        })
    });

    cancelBtn.addEventListener("click", () => {
        confirmModal.classList.add("hidden");
    });
}

function getCustomers() {
    fetch('http://localhost:3000/customer')
    .then(response => response.json())
    .then(data => {
        customers = data;
        customerFilter = data;
        renderRows(customers);
    });
}

function addUpdateEventListeners() {
    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.index;
            const customer = customers.find(c => c.id == id);
            document.getElementById("first-name-update").value = customer.first_name;
            document.getElementById("last-name-update").value = customer.last_name;
            document.getElementById("email-update").value = customer.email;
            document.getElementById("gender-update").value = customer.gender;
            document.getElementById("country-update").value = customer.country;
            document.getElementById("ip-address-update").value = customer.ip_address;

            const modal = document.getElementById("customer-modal-update");
            modal.classList.remove("hidden");

            document.getElementById("customer-form-update").onsubmit = (event) => {
                event.preventDefault();
                const updatedCustomer = {
                    first_name: document.getElementById("first-name-update").value,
                    last_name: document.getElementById("last-name-update").value,
                    email: document.getElementById("email-update").value,
                    gender: document.getElementById("gender-update").value,
                    country: document.getElementById("country-update").value,
                    ip_address: document.getElementById("ip-address-update").value,
                };

                fetch(`http://localhost:3000/customer/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCustomer),
                }).then(() => {
                    modal.classList.add("hidden");
                    getCustomers();
                });
            };
        });
    });
}

getCustomers()
