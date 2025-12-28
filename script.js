/**
 * URBANSTEP SHOES - DATABASE
 */
const products = [
    { id: 1, name: "Air Max Pulse", category: "men", price: 12500, rating: 4.8, img: "image1.jfif", desc: "Revolutionary comfort meets urban style." },
    { id: 2, name: "Zoom Fly 5", category: "sports", price: 8900, rating: 4.5, img: "image2.jfif", desc: "Perfect for long-distance training runs." },
    { id: 3, name: "Street Wave X", category: "casual", price: 4500, rating: 4.2, img: "image3.jfif", desc: "Everyday sneakers for your daily hustle." },
    { id: 4, name: "Velvet Glide", category: "women", price: 6200, rating: 4.7, img: "image4.jfif", desc: "Elegant design with memory foam interior." },
    { id: 5, name: "Apex Runner", category: "sports", price: 11000, rating: 4.9, img: "image5.jfif", desc: "Pro-athlete level grip and performance." },
    { id: 6, name: "Retro Classic", category: "men", price: 5500, rating: 4.4, img: "image6.jfif", desc: "Old school vibe for the new generation." },
    { id: 7, name: "Cloud Walker", category: "casual", price: 3800, rating: 4.0, img: "image7.jfif", desc: "Ultra-lightweight mesh for breathability." },
    { id: 8, name: "Elite Court", category: "sports", price: 13500, rating: 4.8, img: "image8.jfif", desc: "Unmatched stability for court sports." },
    { id: 9, name: "Dune Hiker", category: "men", price: 9200, rating: 4.6, img: "image9.jfif", desc: "Rugged durability for outdoor adventures." },
    { id: 10, name: "Aura Glow", category: "women", price: 7400, rating: 4.7, img: "image10.jfif", desc: "Fashion-forward aesthetics with soft padding." },
    { id: 11, name: "Tempo Dash", category: "sports", price: 8200, rating: 4.3, img: "image11.jfif", desc: "High response foam for explosive speed." },
    { id: 12, name: "Onyx Street", category: "men", price: 6800, rating: 4.5, img: "image12.jfif", desc: "All-black premium leather sneakers." }
];

// App State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentCategory = 'all';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');

/**
 * CORE LOGIC - RENDERING
 */
function renderProducts(items) {
    productGrid.innerHTML = '';
    
    if (items.length === 0) {
        productGrid.innerHTML = '<p class="text-center">No products found for this filter.</p>';
        return;
    }

    items.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="card-img" onclick="openProductDetail(${product.id})">
            <div class="card-info">
                <span class="category-tag">${product.category}</span>
                <h3 onclick="openProductDetail(${product.id})">${product.name}</h3>
                <div class="card-price">₹${product.price.toLocaleString()}</div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    <span class="wishlist-heart" onclick="toggleWishlistItem(${product.id})">
                        ${isWishlisted ? '❤️' : '🤍'}
                    </span>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

/**
 * FILTERING & SEARCH
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const maxPrice = document.getElementById('priceRange').value;
    const sortBy = document.getElementById('sortSelect').value;

    let filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesPrice = p.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === 'low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') filtered.sort((a, b) => b.price - a.price);

    renderProducts(filtered);
}

// Event Listeners for Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        applyFilters();
    });
});

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('sortSelect').addEventListener('change', applyFilters);
document.getElementById('priceRange').addEventListener('input', (e) => {
    document.getElementById('priceValue').innerText = `₹${parseInt(e.target.value).toLocaleString()}`;
    applyFilters();
});

/**
 * MODAL HANDLERS
 */
function openProductDetail(id) {
    const p = products.find(x => x.id === id);
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <img src="${p.img}" class="modal-img">
        <div class="modal-info">
            <h2>${p.name}</h2>
            <p class="card-price">₹${p.price.toLocaleString()}</p>
            <p>${p.desc}</p>
            <div class="size-selector">
                <p>Available Sizes (UK):</p>
                <div class="sizes">
                    <span class="badge">7</span> <span class="badge">8</span> <span class="badge">9</span> <span class="badge">10</span>
                </div>
            </div>
            <button class="btn btn-primary w-100" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `;
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function toggleCart() {
    renderCart();
    document.getElementById('cartModal').style.display = 'flex';
}

function toggleWishlist() {
    renderWishlist();
    document.getElementById('wishlistModal').style.display = 'flex';
}

/**
 * CART LOGIC
 */
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = products.find(x => x.id === id);
        cart.push({ ...p, qty: 1 });
    }
    updateUI();
}

function updateQty(id, delta) {
    const item = cart.find(x => x.id === id);
    item.qty += delta;
    if (item.qty < 1) cart = cart.filter(x => x.id !== id);
    updateUI();
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex:1">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="qty-btn" style="color:red" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
    });
    document.getElementById('cart-total-price').innerText = `₹${total.toLocaleString()}`;
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateUI();
    renderCart();
}

/**
 * WISHLIST LOGIC
 */
function toggleWishlistItem(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
    } else {
        wishlist.push(id);
    }
    updateUI();
    applyFilters();
}

function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    container.innerHTML = '';
    
    wishlist.forEach(id => {
        const p = products.find(x => x.id === id);
        container.innerHTML += `
            <div class="cart-item">
                <img src="${p.img}">
                <div style="flex:1">
                    <h4>${p.name}</h4>
                    <p>₹${p.price.toLocaleString()}</p>
                </div>
                <button class="btn btn-primary" onclick="addToCart(${p.id})">Add</button>
                <button class="qty-btn" onclick="toggleWishlistItem(${p.id})">×</button>
            </div>
        `;
    });
}

/**
 * CHECKOUT & ORDER
 */
function openCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    closeModal('cartModal');
    
    const summary = document.getElementById('orderSummary');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    summary.innerHTML = `<p>Total Items: ${cart.length}</p><h3>Grand Total: ₹${total.toLocaleString()}</h3>`;
    
    document.getElementById('checkoutModal').style.display = 'flex';
}

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
    document.getElementById('orderID').innerText = orderId;
    
    cart = [];
    updateUI();
    closeModal('checkoutModal');
    document.getElementById('orderConfirmModal').style.display = 'flex';
});

/**
 * UTILS
 */
function updateUI() {
    cartCount.innerText = cart.length;
    wishlistCount.innerText = wishlist.length;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Scroll Top Button Logic
const scrollBtn = document.getElementById("scrollTop");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};
scrollBtn.onclick = () => window.scrollTo(0, 0);

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    renderProducts(products);
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}