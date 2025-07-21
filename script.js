// script.js
const menuItems = [
    { name: "Margherita", price: 3 },
    { name: "Diavola", price: 4 },
    { name: "Quattro Formaggi", price: 5 }
];

let takeawayCart = [];
let deliveryCart = [];
const slotCapacity = 20;
const takeawaySlots = {};
const deliverySlots = {};

function init() {
    renderMenu('takeaway');
    renderMenu('delivery');
    populateTimeSlots('pickup-time', 5);
    populateTimeSlots('delivery-time', 15);
    updateCart('takeaway');
    updateCart('delivery');
    setMinDate();
}

function renderMenu(section) {
    const menuContainer = document.querySelector(`#${section} .menu`);
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>€${item.price.toFixed(2)}</p>
            <button onclick="addToCart('${section}', '${item.name}', ${item.price})">Add to Cart</button>
        `;
        menuContainer.appendChild(div);
    });
}

function addToCart(section, name, price) {
    const cart = section === 'takeaway' ? takeawayCart : deliveryCart;
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart(section);
}

function updateCart(section) {
    const cartItems = section === 'takeaway' ? takeawayCart : deliveryCart;
    const cartContainer = document.querySelector(`#${section}-cart-items`);
    const totalContainer = document.querySelector(`#${section}-cart-total`);
    cartContainer.innerHTML = '';
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.textContent = `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;
        cartContainer.appendChild(div);
    });
    if (section === 'takeaway' && document.getElementById('priority').checked) {
        total += 0.50;
    }
    totalContainer.textContent = `Total: €${total.toFixed(2)}`;
}

function populateTimeSlots(selectId, interval) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    const now = new Date();
    for (let i = 0; i < 24 * 60 / interval; i++) {
        const time = new Date(now.getTime() + i * interval * 60 * 1000);
        if (time < now) continue;
        const timeString = time.toTimeString().slice(0, 5);
        const slotKey = `${time.toDateString()}_${timeString}`;
        const isFull = (selectId === 'pickup-time' ? takeawaySlots[slotKey] : deliverySlots[slotKey]) >= slotCapacity;
        if (!isFull) {
            const option = document.createElement('option');
            option.value = slotKey;
            option.textContent = timeString;
            select.appendChild(option);
        }
    }
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', today);
}

function placeOrder(section) {
    const timeSelect = document.getElementById(`${section}-time`);
    const slotKey = timeSelect.value;
    const cart = section === 'takeaway' ? takeawayCart : deliveryCart;
    const totalPizzas = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (section === 'delivery' && !document.getElementById('delivery-address').value) {
        showModal('Please enter a delivery address.');
        return;
    }

    if (!slotKey || totalPizzas === 0) {
        showModal('Please select a time slot and add items to your cart.');
        return;
    }

    if (section === 'takeaway') {
        takeawaySlots[slotKey] = (takeawaySlots[slotKey] || 0) + totalPizzas;
    } else {
        deliverySlots[slotKey] = (deliverySlots[slotKey] || 0) + totalPizzas;
    }

    if ((section === 'takeaway' ? takeawaySlots[slotKey] : deliverySlots[slotKey]) > slotCapacity) {
        showModal('Selected time slot is full. Please choose another.');
        return;
    }

    // Placeholder for API call
    // fetchOrders({ cart, slotKey, priority: section === 'takeaway' && document.getElementById('priority').checked });

    showModal(`Il tuo ordine sarà pronto per ${section === 'takeaway' ? 'il ritiro' : 'la consegna'} alle ${slotKey.split('_')[1]}. Riceverai un SMS quando è pronto!`);
    if (section === 'takeaway') takeawayCart = [];
    else deliveryCart = [];
    updateCart(section);
    populateTimeSlots(`${section}-time`, section === 'takeaway' ? 5 : 15);
}

function bookTable() {
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const guests = document.getElementById('guests').value;

    if (!date || !time || !guests) {
        showModal('Please fill in all booking details.');
        return;
    }

    // Placeholder for API call
    // bookTable({ date, time, guests });

    const isAvailable = Math.random() > 0.3; // Simulate availability
    if (isAvailable) {
        showModal(`Table booked for ${guests} on ${date} at ${time}.`);
    } else {
        showModal('Selected time slot is fully booked. Please choose another.');
    }
}

function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

document.getElementById('priority').addEventListener('change', () => updateCart('takeaway'));
document.addEventListener('DOMContentLoaded', init);
