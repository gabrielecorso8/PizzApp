// script.js
const menuItems = [
    { name: "Margherita", price: 3 },
    { name: "Diavola", price: 4 },
    { name: "Quattro Formaggi", price: 5 },
    { name: "Vegetariana", price: 4.5 }
];

let cart = [];
let slotCapacities = {};
const MAX_PIZZAS_PER_SLOT = 20;

// Initialize menu
function initMenu() {
    const menuContainer = document.getElementById('menu');
    const menuDeliveryContainer = document.getElementById('menu-delivery');
    menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>€${item.price.toFixed(2)}</p>
            <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
        `;
        menuContainer.appendChild(itemDiv);
        menuDeliveryContainer.appendChild(itemDiv.cloneNode(true));
    });
}

// Generate time slots
function generateTimeSlots(incrementMinutes, elementId) {
    const select = document.getElementById(elementId);
    const now = new Date();
    const startTime = new Date(now.getTime() + 30 * 60 * 1000); // Start 30 min from now
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

    select.innerHTML = '<option value="">Select a time</option>';
    for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes() + incrementMinutes)) {
        const slot = time.toTimeString().slice(0, 5);
        const capacity = slotCapacities[slot] || 0;
        if (capacity < MAX_PIZZAS_PER_SLOT) {
            select.innerHTML += `<option value="${slot}">${slot} (${MAX_PIZZAS_PER_SLOT - capacity} slots left)</option>`;
        }
    }
}

// Add to cart
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        cartItems.innerHTML += `<p>${item.name} - €${item.price.toFixed(2)}</p>`;
        total += item.price;
    });

    if (document.getElementById('priority').checked) {
        total += 0.5;
    }

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}

// Show specific section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.getElementById('cart').style.display = 'none';
    if (sectionId === 'takeaway') {
        generateTimeSlots(5, 'pickup-slot');
    } else if (sectionId === 'delivery') {
        generateTimeSlots(15, 'delivery-slot');
    }
}

// Show cart
function showCart() {
    document.getElementById('cart').style.display = 'flex';
    updateCart();
}

// Close cart
function closeCart() {
    document.getElementById('cart').style.display = 'none';
}

// Check delivery availability (placeholder)
function checkDeliveryAvailability() {
    const address = document.getElementById('delivery-address').value;
    if (!address) {
        alert('Please enter a delivery address');
        return;
    }
    // Simulate API call to check delivery area
    fetchDeliveryAvailability(address).then(isAvailable => {
        if (!isAvailable) {
            alert('Delivery not available for this address. Please choose another time slot.');
        } else {
            generateTimeSlots(15, 'delivery-slot');
        }
    });
}

// Placeholder for delivery availability API
function fetchDeliveryAvailability(address) {
    // Simulate API call
    return Promise.resolve(Math.random() > 0.2); // 80% chance of being available
}

// Place order
function placeOrder() {
    const isTakeaway = document.getElementById('takeaway').classList.contains('active');
    const timeSlot = isTakeaway ? document.getElementById('pickup-slot').value : document.getElementById('delivery-slot').value;
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (!timeSlot) {
        alert('Please select a time slot');
        return;
    }

    // Update slot capacity
    slotCapacities[timeSlot] = (slotCapacities[timeSlot] || 0) + cart.length;
    if (slotCapacities[timeSlot] > MAX_PIZZAS_PER_SLOT) {
        alert('Selected time slot is full. Please choose another.');
        return;
    }

    // Simulate API call to place order
    fetchOrders(cart, timeSlot, document.getElementById('priority').checked).then(() => {
        document.getElementById('confirmation-message').textContent = 
            `Il tuo ordine sarà pronto per il ${isTakeaway ? 'ritiro' : 'consegna'} alle ${timeSlot}. Riceverai un SMS quando è pronto!`;
        document.getElementById('confirmation').style.display = 'flex';
        cart = [];
        updateCart();
        generateTimeSlots(is
