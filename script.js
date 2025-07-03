// showForm function and order submission

function showForm(formId) {

    const forms = document.querySelectorAll('.form-box');

    forms.forEach(form => form.style.display = 'none');

    const targetForm = document.getElementById(formId);

    if (targetForm) {

        targetForm.style.display = 'block';

        if (formId === 'Start-Order') {

            const startOrderForm = targetForm.querySelector('form');

            if (startOrderForm) startOrderForm.reset();

        }

        const startMsg = document.getElementById('start-order-msg');

        const closeMsg = document.getElementById('close-order-msg');

        if (formId === 'line order records') {

            startMsg.style.display = window.lastAction === 'start' ? 'block' : 'none';

            closeMsg.style.display = window.lastAction === 'close' ? 'block' : 'none';

        }

    }

}

// Start Order → POST

document.querySelector('#order-form').addEventListener('submit', async function (e) {

    e.preventDefault();

    const name = this.elements['Name'].value;

    const lot = this.elements['Lot Number'].value;

    const module = this.elements['Module'].value;

    const now = new Date().toLocaleString();

    await fetch('https://your-backend-url/orders', {

        method: 'POST',

        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({ timestamp: now, name, lot, module, status: 'PENDING' })

    });

    window.lastAction = 'start';

    showForm('line order records');

    loadOrders();

});

// Load orders to record view

async function loadOrders() {

    const res = await fetch('https://your-backend-url/orders');

    const orders = await res.json();

    const table = document.querySelector('#line\\ order\\ records table');

    table.innerHTML = `<tr><th>Date</th><th>Lot Number</th><th>Module</th><th>Order By</th><th>Status</th><th>Action</th></tr>`;

    orders.forEach(order => {

        const row = table.insertRow();
row.dataset.id = order._id;

        row.innerHTML = `
<td>${order.timestamp}</td>
<td>${order.lot}</td>
<td>${order.module}</td>
<td>${order.name}</td>
<td class="status-cell" style="background:${order.status === 'READY' ? 'lightgreen' : 'yellow'};">${order.status}</td>
<td>

    ${order.status === 'READY' ? '<button class="collect-btn" style="background: blue; color: white;">COLLECT</button>' :

    '<button class="cancel-btn" style="background: green; color: white;">CANCEL</button>'}
</td>`;

    });

}

// Cancel or Collect

document.querySelector('#line\\ order\\ records table').addEventListener('click', async function (e) {

    const row = e.target.closest('tr');

    const id = row.dataset.id;

    if (e.target.classList.contains('cancel-btn')) {

        await fetch(`https://your-backend-url/orders/${id}`, { method: 'DELETE' });

        row.remove();

    } else if (e.target.classList.contains('collect-btn')) {

        row.remove();

    }

});

// Close Order Button

document.querySelector('#close-order-btn').addEventListener('click', () => {

    window.lastAction = 'close';

    openCloseOrderForm();

});

// Show Close Order Table

async function openCloseOrderForm() {

    showForm('close-order-form');

    const res = await fetch('https://your-backend-url/orders');

    const orders = await res.json();

    const closeOrderTable = document.querySelector('#closeOrderTable');

    closeOrderTable.innerHTML = `<tr><th>Date</th><th>Lot Number</th><th>Module</th><th>Order By</th><th>Status</th><th>Action</th></tr>`;

    orders.filter(o => o.status === 'PENDING').forEach(order => {

        const row = closeOrderTable.insertRow();
row.dataset.id = order._id;

        row.innerHTML = `
<td>${order.timestamp}</td>
<td>${order.lot}</td>
<td>${order.module}</td>
<td>${order.name}</td>
<td>${order.status}</td>
<td><button class="close-btn">Close</button></td>`;

    });

}

// Mark as READY

document.querySelector('#closeOrderTable').addEventListener('click', async function (e) {

    if (e.target.classList.contains('close-btn')) {

        const row = e.target.closest('tr');

        const id = row.dataset.id;

        await fetch(`https://your-backend-url/orders/${id}/close`, { method: 'PUT' });

        row.remove();

        loadOrders();

    }

});

window.onload = loadOrders;
 