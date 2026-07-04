// Reactive Application State Variables
let cart = [];
let currentFilter = 'all';
const WHATSAPP_PHONE_NUMBER = "213562163900"; // رقم الواتساب الخاص بالمتجر

function simulateLivePrices() {
    const fluctuate = (val) => val + (Math.random() * 40 - 20);

    setInterval(() => {
        const current24 = parseFloat(document.getElementById('gold24').textContent.replace(/[^\d]/g, ''));
        const current22 = parseFloat(document.getElementById('gold22').textContent.replace(/[^\d]/g, ''));
        const current18 = parseFloat(document.getElementById('gold18').textContent.replace(/[^\d]/g, ''));

        document.getElementById('gold24').textContent = `${Math.round(fluctuate(current24)).toLocaleString()} د.ج`;
        document.getElementById('gold22').textContent = `${Math.round(fluctuate(current22)).toLocaleString()} د.ج`;
        document.getElementById('gold18').textContent = `${Math.round(fluctuate(current18)).toLocaleString()} د.ج`;
    }, 8000);
}
simulateLivePrices();

function renderCatalog() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = currentFilter === 'all'
        ? PRODUCT_DB
        : PRODUCT_DB.filter(p => p.category === currentFilter);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = "bg-onyx-card border border-onyx-border hover:border-gold-500/30 rounded-3xl overflow-hidden group transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] flex flex-col justify-between";

        card.innerHTML = `
            <div class="relative overflow-hidden aspect-square bg-zinc-950">
                <img src="${product.img}" alt="${product.name}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <button onclick="openProductDetailModal('${product.id}')" class="px-5 py-2.5 bg-white/15 hover:bg-gold-500/80 hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md transition-all duration-300 w-full cursor-pointer">
                        عرض التفاصيل الفنية
                    </button>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow justify-between">
                <div>
                    <span class="text-[9px] text-gold-400 tracking-widest uppercase font-extrabold">${product.category}</span>
                    <h3 class="text-lg font-serif font-bold text-white mt-1.5 mb-2 group-hover:text-gold-300 transition-colors duration-300">${product.name}</h3>
                </div>
                <div class="mt-6 pt-4 border-t border-onyx-border/80 flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-[9px] text-zinc-500 uppercase">السعر التقديري</span>
                        <span class="text-md font-mono text-[#FCF6BA] font-bold">${product.price.toLocaleString()} د.ج</span>
                    </div>
                    <button onclick="addToCart('${product.id}')" class="w-10 h-10 rounded-full bg-onyx-light hover:bg-gold-500 hover:text-black border border-onyx-border hover:border-gold-500 flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:scale-110">
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCatalog(category) {
    currentFilter = category;

    // Set active states visually on buttons
    const buttons = ['all', 'rings', 'necklaces', 'bracelets'];
    const labels = { all: 'all', rings: 'خواتم', necklaces: 'قلادات', bracelets: 'أساور' };

    buttons.forEach(btn => {
        const element = document.getElementById(`filter-${btn}`);
        if (!element) return;

        if (labels[btn] === category || (btn === 'all' && category === 'all')) {
            element.className = "px-6 py-2.5 rounded-full bg-gold-500 text-black text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.2)]";
        } else {
            element.className = "px-6 py-2.5 rounded-full bg-onyx-light border border-onyx-border text-zinc-400 hover:text-white hover:border-gold-500/50 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer";
        }
    });

    renderCatalog();
}

function adjustRingSizeFinder(val) {
    const visual = document.getElementById('ringVisualCircle');
    const diameterText = document.getElementById('ring-diameter');
    const usSizeText = document.getElementById('ring-size-us');

    // Convert to pixels safely for standard screens
    const pixelSize = val * 8;
    visual.style.width = `${pixelSize}px`;
    visual.style.height = `${pixelSize}px`;

    diameterText.textContent = `${val} مم`;

    // Approximate conversions for US ring sizes
    let usSize = "مجهول";
    if (val >= 14 && val < 14.8) usSize = "3 - 4";
    else if (val >= 14.8 && val < 15.6) usSize = "4 - 5";
    else if (val >= 15.6 && val < 16.5) usSize = "5 - 6";
    else if (val >= 16.5 && val < 17.3) usSize = "6 - 7";
    else if (val >= 17.3 && val < 18.2) usSize = "7 - 8";
    else if (val >= 18.2 && val < 19.0) usSize = "8 - 9";
    else if (val >= 19.0 && val < 19.8) usSize = "9 - 10";
    else if (val >= 19.8 && val < 20.6) usSize = "10 - 11";
    else if (val >= 20.6) usSize = "11+";

    usSizeText.textContent = usSize;
}

function showToast(title, body) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = "bg-onyx-card border border-gold-500/30 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-500 flex items-center gap-3 w-80";

    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gold-600/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
            <i class="fa-solid fa-gem"></i>
        </div>
        <div>
            <h5 class="text-xs font-bold text-white">${title}</h5>
            <p class="text-[10px] text-zinc-400 mt-0.5">${body}</p>
        </div>
    `;

    container.appendChild(toast);

    // Animate In
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 50);

    // Animate Out
    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

function addToCart(id) {
    const product = PRODUCT_DB.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        cart = cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
    } else {
        cart = [...cart, { ...product, qty: 1 }];
    }
    updateCartDOM();
    showToast("تمت الإضافة للمقتنيات", \`\${product.name} أصبح الآن بالسلة.\`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDOM();
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;

    if (newQty <= 0) {
        removeFromCart(id);
    } else {
        cart = cart.map(i => i.id === id ? { ...i, qty: newQty } : i);
        updateCartDOM();
    }
}

function toggleCartModal() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('translate-x-full');
    drawer.classList.toggle('pointer-events-none');
}

function updateCartDOM() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalQty;
    cartCount.classList.toggle('hidden', totalQty === 0);

    cartItems.innerHTML = '';
    let finalPrice = 0;

    cart.forEach(item => {
        const dbProduct = PRODUCT_DB.find(p => p.id === item.id);
        const verifiedPrice = dbProduct ? dbProduct.price : 0;
        const subtotal = verifiedPrice * item.qty;
        finalPrice += subtotal;

        const row = document.createElement('div');
        row.className = "flex items-center justify-between gap-4 border-b border-onyx-border pb-4";
        row.innerHTML = \`
            <div class="flex items-center gap-3">
                <img src="\${item.img}" class="w-12 h-12 object-cover rounded-lg bg-zinc-950 border border-onyx-border" alt="">
                <div>
                    <h4 class="text-xs font-bold text-white max-w-[150px] truncate">\${item.name}</h4>
                    <span class="text-[10px] text-zinc-500">\${verifiedPrice.toLocaleString()} د.ج</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex items-center bg-onyx-solid rounded-lg border border-onyx-border px-1">
                    <button onclick="updateCartQty('\${item.id}', -1)" class="w-6 h-6 text-zinc-400 hover:text-white">-</button>
                    <span class="text-xs text-white px-2 font-mono">\${item.qty}</span>
                    <button onclick="updateCartQty('\${item.id}', 1)" class="w-6 h-6 text-zinc-400 hover:text-white">+</button>
                </div>
                <button onclick="removeFromCart('\${item.id}')" class="text-zinc-600 hover:text-red-400 text-xs transition-colors"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        \`;
        cartItems.appendChild(row);
    });

    cartTotal.textContent = \`\${finalPrice.toLocaleString()} د.ج\`;
}

function openProductDetailModal(id) {
    const product = PRODUCT_DB.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modal-product-img').src = product.img;
    document.getElementById('modal-product-img').alt = product.name;
    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-product-cat').textContent = product.category;
    document.getElementById('modal-product-price').textContent = \`\${product.price.toLocaleString()} د.ج\`;

    const btn = document.getElementById('modal-add-to-cart-btn');
    btn.onclick = () => {
        addToCart(product.id);
        closeProductDetailModal();
    };

    const modal = document.getElementById('product-detail-modal');
    modal.classList.remove('pointer-events-none', 'opacity-0');
}

function closeProductDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    modal.classList.add('pointer-events-none', 'opacity-0');
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        showToast("حقيبة المقتنيات فارغة", "يرجى إضافة قطع فنية فريدة لتأكيد طلبك.");
        return;
    }

    let textPayload = \`*طلب مجوهرات جديد - بوتيك النخبة الفاخرة*\\n\`;
    textPayload += \`===============================\\n\`;

    let finalPriceTotal = 0;
    cart.forEach((item, index) => {
        const dbProduct = PRODUCT_DB.find(p => p.id === item.id);
        const verifiedPrice = dbProduct ? dbProduct.price : 0;
        const subtotal = verifiedPrice * item.qty;
        finalPriceTotal += subtotal;

        // Security check and sanitization
        const sanitizedName = item.name.replace(/[^\\w\\s\\u0600-\\u06FF]/g, '');

        textPayload += \`\${index + 1}. *\${sanitizedName}*\\n\`;
        textPayload += \`   الكمية المطلوبة: \${parseInt(item.qty)}\\n\`;
        textPayload += \`   التكلفة التقديرية: \${subtotal.toLocaleString()} د.ج\\n\`;
    });

    textPayload += \`===============================\\n\`;
    textPayload += \`*إجمالي الفاتورة الإفتراضي:* \${finalPriceTotal.toLocaleString()} د.ج\\n\\n\`;
    textPayload += \`يرجى مراجعة وتجهيز الفواتير وبطاقات النقاء وتأكيد التوفر للتوصيل.\`;

    const encodedText = encodeURIComponent(textPayload);
    const targetUrl = \`https://api.whatsapp.com/send?phone=\${WHATSAPP_PHONE_NUMBER}&text=\${encodedText}\`;

    // Mitigating Reverse Tabnabbing Vulnerability
    const isolatedWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (isolatedWindow) isolatedWindow.opener = null;
}

// Initialize App Catalogs on Load
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    adjustRingSizeFinder(16.5);
});