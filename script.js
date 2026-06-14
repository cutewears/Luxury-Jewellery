// --- WHATSAPP CONFIGURATION ---
const WHATSAPP_NUMBER = "919820997084"; 

// --- PRODUCT DATABASE (Luxury Jewellery) ---
const products = [
    { id: 1, name: "Pearl Bloom Earring", price: 5000, image: "photos/item-1.jpg" },
    { id: 2, name: "Sunflower Earrings", price: 45000, image: "photos/item-2.jpg" },
    { id: 3, name: "Hand Stack", price: 8500, image: "photos/item-3.jpg" },
    { id: 4, name: "Heart Lock Earrings", price: 18000, image: "photos/item-4.jpg" },
    { id: 5, name: "Sapphire Halo Ring", price: 32000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "Classic Gold Hoops", price: 15000, image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800" }
];

// --- CART STATE ---
let cart = [];
try {
    const savedCart = JSON.parse(localStorage.getItem('cutewears_cart'));
    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item => item && item.id && item.name && item.price);
    }
} catch (e) {
    cart = [];
}

// --- INITIALIZE PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        const limit = productContainer.dataset.limit ? parseInt(productContainer.dataset.limit) : products.length;
        renderProducts(productContainer, limit);
    }
});

// --- RENDER PRODUCTS ---
function renderProducts(container, limit) {
    const itemsToShow = products.slice(0, limit);
    container.innerHTML = itemsToShow.map(product => `
        <div class="group flex flex-col cursor-pointer bg-white p-3 md:p-4 rounded-md shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100">
            <div class="relative overflow-hidden bg-neutral-100 aspect-square mb-3 md:mb-4 rounded-sm">
                <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-full md:group-hover:scale-105 transition duration-700 ease-out">
                <button onclick="addToCart(${product.id})" class="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 bg-white/95 backdrop-blur text-black py-2.5 md:py-3 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-medium text-[10px] md:text-xs tracking-widest uppercase shadow-sm">
                    Add to Bag
                </button>
            </div>
            <div class="flex flex-col items-center text-center px-1 pb-1">
                <h3 class="text-neutral-900 font-medium text-xs md:text-sm line-clamp-1 w-full">${product.name}</h3>
                <span class="text-neutral-500 tracking-wide text-xs md:text-sm mt-1">₹${product.price.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `).join('');
}

// --- MOBILE MENU LOGIC ---
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
};

// --- CART LOGIC ---
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
};

window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    saveCart();
    updateCartUI();
};

window.removeItem = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('cutewears_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyMsg = document.getElementById('empty-cart-msg');

    if(!cartBadge || !cartItemsContainer) return; 

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if(emptyMsg) emptyMsg.style.display = 'block';
        if(cartTotal) cartTotal.textContent = '₹0';
        return;
    }

    if(emptyMsg) emptyMsg.style.display = 'none';
    let totalValue = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        totalValue += item.price * item.quantity;
        return `
            <div class="flex gap-4 border-b border-neutral-100 pb-5">
                <img src="${item.image}" class="w-20 h-20 object-cover bg-neutral-100 flex-shrink-0">
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="pr-2">
                            <h4 class="text-sm font-medium text-neutral-900 leading-tight">${item.name}</h4>
                            <p class="text-sm text-neutral-500 mt-1">₹${item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button onclick="removeItem(${item.id})" class="text-neutral-400 hover:text-black transition p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="flex items-center w-max border border-neutral-200 mt-3">
                        <button onclick="updateQuantity(${item.id}, -1)" class="px-3 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50 transition">-</button>
                        <span class="px-3 text-sm font-medium w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="px-3 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50 transition">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if(cartTotal) cartTotal.textContent = `₹${totalValue.toLocaleString('en-IN')}`;
}

window.toggleCart = function() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
};

window.openCart = function() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
};

window.checkoutWhatsApp = function() {
    if (cart.length === 0) return alert("Your bag is empty!");

    let message = `✨ *New Order – Cutewears* ✨\n\n`;
    message += `🛍️ *Order Details:*\n\n`;
    
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━\n`;
    message += ` *Total Amount:* ₹${subtotal.toLocaleString('en-IN')}\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `Please confirm product availability and share the payment details.\n\n`;
    message += `Thank you! `;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
};