// Initialize the cart from localStorage or create an empty one
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add event listeners to Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.parentElement.querySelector('h3').textContent.trim();
        const price = parseFloat(button.parentElement.querySelector('p').textContent.replace('Rs. ', ''));
        if (product && !isNaN(price)) {
            addToCart(product, price);
        } else {
            console.error('Invalid product or price');
        }
    });
});

// Function to add items to the cart
function addToCart(product, price) {
    let existingProduct = cart.find(item => item.product == product);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ product, price, quantity: 1 });
    }
    updateLocalStorage();
    alert(`${product} has been added to your cart!`);
}

// Save cart to localStorage
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Display cart items on the cart page
function displayCart() {
    let cartItems = document.querySelector('#cart-items tbody');
    let cartTotal = document.getElementById('cart-total');
    let cartMessage = document.querySelector('.cart-message');
    
    if (!cartItems) return; // Exit if not on the cart page

    // Clear previous content
    cartItems.innerHTML = '';
    let total = 0;

    // Check if cart is empty
    if (cart.length == 0) {
        cartMessage.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
        return;
    } else {
        cartMessage.innerHTML = ''; // Clear empty cart message
    }

    // Populate cart items
    cart.forEach(item => {
        if (item.product && item.price && item.quantity) {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItems.innerHTML += `
                <tr>
                    <td>${item.product}</td>
                    <td>
                        <button class="quantity-btn decrease" data-product="${item.product}">-</button>
                        ${item.quantity}
                        <button class="quantity-btn increase" data-product="${item.product}">+</button>
                    </td>
                    <td>Rs. ${item.price.toFixed(2)}</td>
                    <td>Rs. ${itemTotal.toFixed(2)}</td>
                    <td><button class="remove-item" data-product="${item.product}">Remove</button></td>
                </tr>
            `;
        }
    });

    cartTotal.textContent = total.toFixed(2);

    // Add event listeners to Remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            removeFromCart(product);
        });
    });

    // Add event listeners to Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            if (button.classList.contains('increase')) {
                changeQuantity(product, 1);
            } else if (button.classList.contains('decrease')) {
                changeQuantity(product, -1);
            }
        });
    });
}

// Function to change the quantity of items in the cart
function changeQuantity(product, amount) {
    let item = cart.find(item => item.product === product);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            removeFromCart(product);
        } else {
            updateLocalStorage();
            displayCart();
        }
    }
}

// Function to remove items from the cart
function removeFromCart(product) {
    cart = cart.filter(item => item.product !== product);
    updateLocalStorage();
    displayCart();
}

// Function to handle checkout
function checkout() {
    // Perform checkout operations (e.g., sending data to the server)
    
    // Clear the cart after successful checkout
    clearCart();

    // Redirect to a confirmation page or refresh the cart page
    //window.location.href = 'confirmation.html'; // Or use a location.reload() if staying on the same page
    alert(`Confirmed Order`);
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    cart = [];
    displayCart(); // Clear cart display on the page
}

// Add event listener to the checkout button
document.getElementById('checkout-btn')?.addEventListener('click', checkout);

// Function to handle login form submission
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    window.location.href = 'shop.html'; // Redirect to shopping page
});

// Call displayCart when loading the cart page
document.addEventListener('DOMContentLoaded', displayCart);