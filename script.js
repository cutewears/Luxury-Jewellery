// --- WHATSAPP & INSTAGRAM CONFIGURATION ---
const WHATSAPP_NUMBER = "919820997084"; 
const INSTAGRAM_USERNAME = "cutewears.vs";

// --- PRODUCT DATABASE (Luxury Jewellery) ---
const products = [
    { id: 1, name: "Double Cushion Pearlescent Earrings", price: 2100, image: "photos/item-1.jpeg" },
    { id: 2, name: "Cascadding Golden Honeybee Earrings", price: 1800, image: "photos/item-21.jpeg" },
    { id: 3, name: "Gold Five-Petal Pearl Earrings", price: 1600, image: "photos/item-17.jpeg" },
    { id: 4, name: "Four-Petal Crystal Earrings", price: 1800, image: "photos/item-4.jpeg" },
    { id: 5, name: "Luxe Mixed Gold Bangle Stack (Set of Four)", price: 5800, image: "photos/item-5.jpeg" },
    { id: 6, name: "Floral Cocktail Ring", price: 1700, image: "photos/item-6.jpeg" },
    { id: 7, name: "Multi-Gemstone Lariate Necklace", price: 1250, image: "photos/item-7.jpeg" },
    { id: 8, name: "Gold Fishbone Earring", price: 1700, image: "photos/item-8.jpeg" },
    { id: 9, name: "Cushion-Cut Pearl Button Studs", price: 1300, image: "photos/item-9.jpeg" },
    { id: 10, name: "Vertical Multi-Stone Drop Necklace", price: 1250, image: "photos/item-10.jpeg" },
    { id: 11, name: "Sculptural Pavé Crystal Dangles", price: 1600, image: "photos/item-11.jpeg" },
    { id: 12, name: "Minimalist Gold Chain", price: 900, image: "photos/item-12.jpeg" },
    { id: 13, name: "Double Gold Orb Drop Earrings", price: 1400, image: "photos/item-13.jpeg" },
    { id: 14, name: "Golden Sunburst Pearl Earrings", price: 1200, image: "photos/item-14.jpeg" },
    { id: 15, name: "Gold Lip Crystal Earrings", price: 1600, image: "photos/item-15.jpeg" },
    { id: 16, name: "Pearl Gold Knot Drop Earrings", price: 1350, image: "photos/item-16.jpeg" },
    { id: 17, name: "Crinkled Gold Dangle Earrings", price: 1300, image: "photos/item-3.jpeg" },
    { id: 18, name: "Gold Blossom Pearl Studs", price: 1400, image: "photos/item-18.jpeg" },
    { id: 19, name: "Gold Open-Circle Pearl Earrings", price: 1600, image: "photos/item-19.jpeg" },
    { id: 20, name: "Mixed-Cut Gemstone Y-Necklace", price: 1250, image: "photos/item-20.jpeg" },
    { id: 21, name: "Textured Pearl Button Earrings ", price: 1350, image: "photos/item-2.jpeg" },
    { id: 22, name: "Pearl Bloom Earring", price: 1400, image: "photos/item-22.jpeg" },
    { id: 23, name: "Gold Honeybee Pearl Studs", price: 1500, image: "photos/item-23.jpeg" },
    { id: 24, name: "Golden Pearl Drop Earrings", price: 1500, image: "photos/item-24.jpeg" }
];

// --- APP STATE (Cart & Wishlist) ---
let cart = [];
let wishlist = [];

try {
    const savedCart = JSON.parse(localStorage.getItem('cutewears_cart'));
    if (Array.isArray(savedCart)) cart = savedCart.filter(item => item && item.id && item.name && item.price);
    
    const savedWishlist = JSON.parse(localStorage.getItem('cutewears_wishlist'));
    if (Array.isArray(savedWishlist)) wishlist = savedWishlist;
} catch (e) {
    cart = [];
    wishlist = [];
}

// --- INITIALIZE PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="product-modal-overlay" class="fixed inset-0 bg-black/70 z-[60] hidden flex items-end md:items-center justify-center backdrop-blur-sm opacity-0 transition-opacity duration-300 md:px-4">
            <div id="product-modal-content" class="bg-white p-5 md:p-8 rounded-t-3xl md:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] md:max-h-[85vh] overflow-y-auto transform translate-y-full md:translate-y-0 md:scale-95 transition-transform duration-300 relative flex flex-col md:flex-row gap-6 md:gap-10 no-scrollbar">
            </div>
        </div>
        <div id="toast-notification" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium z-[70] translate-y-20 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-2">
            <span id="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
            <span id="toast-message">Successfully added to bag!</span>
        </div>
    `);

    document.getElementById('product-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'product-modal-overlay') closeProductModal();
    });

    updateCartUI();
    
    const productContainer = document.getElementById('product-container');
    const wishlistContainer = document.getElementById('wishlist-container');
    
    if (productContainer) {
        const limit = productContainer.dataset.limit ? parseInt(productContainer.dataset.limit) : products.length;
        renderProducts(productContainer, limit);
    }
    
    if (wishlistContainer) {
        renderWishlist();
    }
});

// --- RENDER PRODUCTS ---
function renderProducts(container, limit) {
    const itemsToShow = products.slice(0, limit);
    
    container.innerHTML = itemsToShow.map(product => {
        const isWished = wishlist.includes(product.id);
        const heartSVG = isWished 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#E1306C" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

        return `
        <div class="group flex flex-col bg-white border border-neutral-100 p-2.5 md:p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div class="relative overflow-hidden bg-neutral-100 aspect-square mb-3 md:mb-4 rounded-lg cursor-pointer" onclick="openProductModal(${product.id})">
                <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" class="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-neutral-400 hover:text-[#E1306C] hover:scale-110 transition shadow-sm">
                    ${heartSVG}
                </button>
                <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-full md:group-hover:scale-105 transition duration-700 ease-out">
            </div>
            <div class="flex flex-col items-center text-center px-1 pb-1 cursor-pointer" onclick="openProductModal(${product.id})">
                <h3 class="text-neutral-900 font-medium text-xs md:text-sm line-clamp-1 w-full group-hover:text-neutral-500 transition">${product.name}</h3>
                <span class="text-neutral-500 tracking-wide text-xs md:text-sm mt-1">₹${product.price.toLocaleString('en-IN')}</span>
            </div>
        </div>
        `;
    }).join('');
}

// --- RENDER WISHLIST PAGE ---
function renderWishlist() {
    const container = document.getElementById('wishlist-container');
    if (!container) return; 

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <h2 class="text-xl font-serif text-neutral-800 mb-2">Your wishlist is empty</h2>
                <p class="text-neutral-500 text-sm mb-6 max-w-md">Looks like you haven't added anything to your wishlist yet. Explore our collections to find something beautiful.</p>
                <a href="products.html" class="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-medium hover:bg-neutral-800 transition">Explore Jewellery</a>
            </div>
        `;
        return;
    }

    const wishedProducts = products.filter(p => wishlist.includes(p.id));
    
    container.innerHTML = wishedProducts.map(product => {
        const heartSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#E1306C" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

        return `
        <div class="group flex flex-col bg-white border border-neutral-100 p-2.5 md:p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div class="relative overflow-hidden bg-neutral-100 aspect-square mb-3 md:mb-4 rounded-lg cursor-pointer" onclick="openProductModal(${product.id})">
                <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" class="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-neutral-400 hover:text-[#E1306C] hover:scale-110 transition shadow-sm">
                    ${heartSVG}
                </button>
                <img src="${product.image}" alt="${product.name}" class="object-cover w-full h-full md:group-hover:scale-105 transition duration-700 ease-out">
            </div>
            <div class="flex flex-col items-center text-center px-1 pb-1 cursor-pointer" onclick="openProductModal(${product.id})">
                <h3 class="text-neutral-900 font-medium text-xs md:text-sm line-clamp-1 w-full group-hover:text-neutral-500 transition">${product.name}</h3>
                <span class="text-neutral-500 tracking-wide text-xs md:text-sm mt-1">₹${product.price.toLocaleString('en-IN')}</span>
            </div>
        </div>
        `;
    }).join('');
}

// --- WISHLIST LOGIC ---
window.toggleWishlist = function(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist", "wishlist");
    } else {
        wishlist.push(productId);
        showToast("Added to wishlist!", "wishlist");
    }
    
    localStorage.setItem('cutewears_wishlist', JSON.stringify(wishlist));
    
    const productContainer = document.getElementById('product-container');
    const wishlistContainer = document.getElementById('wishlist-container');
    
    if (productContainer) {
        const limit = productContainer.dataset.limit ? parseInt(productContainer.dataset.limit) : products.length;
        renderProducts(productContainer, limit);
    }
    
    if (wishlistContainer) {
        renderWishlist();
    }
};

// --- PRODUCT MODAL LOGIC ---
let currentModalQty = 1;
let modalTotalAdded = 0;

window.openProductModal = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentModalQty = 1;
    modalTotalAdded = 0;

    const modalContent = document.getElementById('product-modal-content');
    
    modalContent.innerHTML = `
        <button onclick="closeProductModal()" class="absolute top-4 right-4 z-20 text-neutral-400 hover:text-black p-2 bg-white/90 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        
        <div class="w-full md:w-1/2 bg-neutral-50 rounded-xl overflow-hidden h-64 md:h-auto md:min-h-[450px] relative flex-shrink-0">
            <img src="${product.image}" class="w-full h-full object-cover absolute inset-0">
        </div>
        
        <div class="w-full md:w-1/2 flex flex-col justify-center py-2 md:py-6">
            <h2 class="text-2xl md:text-3xl font-serif mb-2 text-neutral-900 leading-tight pr-8">${product.name}</h2>
            <p class="text-lg md:text-xl font-medium mb-6 text-neutral-800">₹${product.price.toLocaleString('en-IN')}</p>

            <div class="bg-[#faf9f8] border border-neutral-200 rounded-xl p-4 md:p-5 mb-6 space-y-4 text-xs md:text-sm text-neutral-800">
                <div class="flex items-start gap-3">
                    <svg class="flex-shrink-0 mt-0.5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    <span class="leading-snug">Estimate delivery times: <strong class="font-semibold text-black">3-5 days</strong></span>
                </div>
                <hr class="border-neutral-200 border-dashed">
                <div class="flex items-start gap-3">
                    <svg class="flex-shrink-0 mt-0.5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span class="leading-snug"><strong class="font-semibold text-black">No Cash On Delivery</strong> (Prepaid Only)</span>
                </div>
                <hr class="border-neutral-200 border-dashed">
                <div class="flex items-start gap-3">
                    <svg class="flex-shrink-0 mt-0.5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                    <span class="leading-snug">Enjoy Free Shipping on Orders Above <strong class="font-semibold text-black">₹3100</strong></span>
                </div>
            </div>

            <p class="text-xs md:text-sm text-neutral-500 mb-5">Hurry up! Only <span class="text-[#D32F2F] font-medium">Limited items</span> left in stock</p>

            <div class="flex flex-col sm:flex-row gap-3 items-center">
                <div class="flex items-center border border-neutral-300 rounded-full overflow-hidden bg-white w-full sm:w-32 justify-between flex-shrink-0 h-12">
                    <button onclick="updateModalQty(-1)" class="px-4 h-full hover:bg-neutral-50 transition flex items-center justify-center w-full text-lg">-</button>
                    <span id="modal-qty" class="text-center font-medium w-full pointer-events-none">1</span>
                    <button onclick="updateModalQty(1)" class="px-4 h-full hover:bg-neutral-50 transition flex items-center justify-center w-full text-lg">+</button>
                </div>

                <button onclick="addFromModal(${product.id})" class="w-full flex-1 bg-black text-white h-12 px-6 rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-neutral-800 transition flex justify-center items-center gap-2">
                    Add to Cart <span id="modal-btn-counter" class="bg-white text-black w-5 h-5 flex items-center justify-center rounded-full text-[10px] hidden font-bold">0</span>
                </button>
            </div>

            <button onclick="shareProduct(${product.id})" class="mt-5 flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-neutral-500 hover:text-black transition w-full py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share this product
            </button>
        </div>
    `;

    const overlay = document.getElementById('product-modal-overlay');
    const modalWindow = document.getElementById('product-modal-content');
    
    overlay.classList.remove('hidden');
    // Small delay to allow display:block to apply before animating opacity/transform
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        if(window.innerWidth < 768) {
            modalWindow.classList.remove('translate-y-full'); // Mobile slides up
        } else {
            modalWindow.classList.remove('scale-95'); // Desktop scales up
        }
    }, 10);
};

window.closeProductModal = function() {
    const overlay = document.getElementById('product-modal-overlay');
    const modalContent = document.getElementById('product-modal-content');
    
    overlay.classList.add('opacity-0');
    if(window.innerWidth < 768) {
        modalContent.classList.add('translate-y-full');
    } else {
        modalContent.classList.add('scale-95');
    }
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
};

window.updateModalQty = function(change) {
    if (currentModalQty + change >= 1) {
        currentModalQty += change;
        document.getElementById('modal-qty').innerText = currentModalQty;
    }
};

window.addFromModal = function(productId) {
    addToCart(productId, currentModalQty);
    
    modalTotalAdded += currentModalQty;
    const btnCounter = document.getElementById('modal-btn-counter');
    btnCounter.innerText = modalTotalAdded;
    btnCounter.classList.remove('hidden');
    
    currentModalQty = 1;
    document.getElementById('modal-qty').innerText = currentModalQty;
};

// --- AMAZON-STYLE IMAGE SHARE LOGIC ---
window.shareProduct = async function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productUrl = "https://cutewears.github.io/Luxury-Jewellery/products.html";
    const textToShare = `Check out ${product.name} for ₹${product.price.toLocaleString('en-IN')} at Cutewears!`;

    try {
        const response = await fetch(product.image);
        const blob = await response.blob();
        
        const fileExtension = product.image.split('.').pop() || 'jpeg';
        const file = new File([blob], `cutewears-product-${product.id}.${fileExtension}`, { type: blob.type });

        const shareData = {
            title: 'Cutewears Jewellery',
            text: textToShare,
            url: productUrl,
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
            await navigator.share(shareData);
        } else if (navigator.share) {
            await navigator.share(shareData);
        } else {
            fallbackCopy(`${textToShare} \n\nShop here: ${productUrl}`);
        }
    } catch (error) {
        console.error("Error sharing product:", error);
        if (navigator.share) {
            navigator.share({
                title: 'Cutewears Jewellery',
                text: textToShare,
                url: productUrl
            }).catch(err => fallbackCopy(`${textToShare} \n\nShop here: ${productUrl}`));
        } else {
            fallbackCopy(`${textToShare} \n\nShop here: ${productUrl}`);
        }
    }
};

function fallbackCopy(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("Link copied to clipboard!", "success");
        }).catch(err => {
            forceLegacyCopy(text);
        });
    } else {
        forceLegacyCopy(text);
    }
}

function forceLegacyCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; 
    textArea.style.left = "-999999px"; 
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast("Link copied to clipboard!", "success");
    } catch (err) {
        showToast("Failed to copy link.", "error");
    }
    textArea.remove();
}

// --- MOBILE MENU LOGIC ---
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
};

// --- CART & TOAST LOGIC ---
let toastTimeout;
window.showToast = function(msg = "Successfully added to bag!", type = "cart") {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    if (!toast) return;

    if (toastMsg) toastMsg.innerText = msg;
    
    if (type === "wishlist") {
        toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#E1306C" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    } else {
        toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    }

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
};

window.addToCart = function(productId, qty = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }

    saveCart();
    updateCartUI();
    showToast("Successfully added to bag!", "cart");
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
    const cartFooter = document.querySelector('#cart-drawer .border-t.bg-neutral-50');

    if(!cartBadge || !cartItemsContainer) return; 

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-neutral-500 text-center mt-10 text-sm">Your shopping bag is empty.</p>';
        if(cartFooter) {
            cartFooter.innerHTML = generateCartFooterHtml(0);
        }
        return;
    }

    let totalValue = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        totalValue += item.price * item.quantity;
        return `
            <div class="flex gap-4 border-b border-neutral-100 pb-5">
                <img src="${item.image}" class="w-20 h-20 object-cover bg-neutral-100 flex-shrink-0 rounded-md">
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <div class="pr-2">
                            <h4 class="text-sm font-medium text-neutral-900 leading-tight">${item.name}</h4>
                            <p class="text-sm text-neutral-500 mt-1">₹${item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button onclick="removeItem(${item.id})" class="text-neutral-400 hover:text-black transition p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                    <div class="flex items-center w-max border border-neutral-200 mt-3 rounded-md overflow-hidden">
                        <button onclick="updateQuantity(${item.id}, -1)" class="px-3 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50 transition bg-white">-</button>
                        <span class="px-3 text-xs font-medium w-8 text-center bg-white">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="px-3 py-1 text-neutral-500 hover:text-black hover:bg-neutral-50 transition bg-white">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (cartFooter) {
        cartFooter.innerHTML = generateCartFooterHtml(totalValue);
    }
}

function generateCartFooterHtml(totalValue) {
    let shippingHtml = '';
    
    if (totalValue > 0) {
        if (totalValue >= 3100) {
            shippingHtml = `<div class="text-center mb-4 text-xs font-medium text-[#25D366] bg-[#25D366]/10 py-2 rounded-md border border-[#25D366]/20">✨ Free Shipping Unlocked! ✨</div>`;
        } else {
            const remaining = 3100 - totalValue;
            shippingHtml = `<div class="text-center mb-4 text-xs text-neutral-600 bg-white py-2 rounded-md border border-neutral-200">Add ₹${remaining.toLocaleString('en-IN')} more for <strong class="text-black">Free Shipping</strong></div>`;
        }
    }

    return `
        ${shippingHtml}
        <div class="flex justify-between text-lg font-medium text-neutral-900 mb-6">
            <span>Total</span><span id="cart-total">₹${totalValue.toLocaleString('en-IN')}</span>
        </div>
        <div class="flex flex-col gap-3">   
            <button onclick="checkoutWhatsApp()" class="w-full bg-[#25D366] text-white py-3.5 rounded-none uppercase tracking-widest text-xs font-semibold hover:bg-[#128C7E] transition flex justify-center items-center gap-2">
                Checkout via WhatsApp
            </button>
            <p class="text-center text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold">⚠️ No Cash on Delivery (Prepaid Only)</p>
        </div>
    `;
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

    let message = generateCheckoutMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
};

function generateCheckoutMessage() {
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
    
    if (subtotal >= 3100) {
         message += ` *Shipping:* Free Shipping Unlocked! ✨\n`;
    }
    
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `⚠️ Note: No Cash on Delivery (Prepaid Only)\n\n`;
    message += `Please confirm product availability and share the payment details.\n\n`;
    message += `Thank you! `;
    
    return message;
}
