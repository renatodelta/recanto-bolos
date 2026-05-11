

// Estado do Carrinho
let cart = [];

// Formata preço para Real (R$)
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Verifica se a loja está aberta
const checkStoreStatus = () => {
    const statusBadge = document.getElementById('store-status');
    const closedBanner = document.getElementById('closed-banner');

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const [openH, openM] = storeData.openingTime.split(':').map(Number);
    const [closeH, closeM] = storeData.closingTime.split(':').map(Number);

    const openTime = openH * 100 + openM;
    const closeTime = closeH * 100 + closeM;

    const isOpen = currentTime >= openTime && currentTime < closeTime;

    if (isOpen) {
        statusBadge.querySelector('.status-text').textContent = 'Aberto';
        statusBadge.classList.add('open');
        statusBadge.classList.remove('closed');
        closedBanner.classList.add('hidden');
    } else {
        statusBadge.querySelector('.status-text').textContent = 'Fechado';
        statusBadge.classList.add('closed');
        statusBadge.classList.remove('open');
        closedBanner.classList.remove('hidden');
    }
};

// Renderiza o cardápio
const renderMenu = (filterQuery = '') => {
    const menuSection = document.getElementById('menu-section');
    menuSection.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();

    // Se houver categorias, mantém a lógica original
    if (categories && categories.length > 0) {
        categories.forEach(category => {
            let categoryProducts = products.filter(p => p.category === category.id);
            if (query) {
                categoryProducts = categoryProducts.filter(p =>
                    p.name.toLowerCase().includes(query) ||
                    (p.desc && p.desc.toLowerCase().includes(query))
                );
            }
            if (categoryProducts.length === 0) return;

            const categoryBlock = document.createElement('div');
            categoryBlock.classList.add('category-block');
            categoryBlock.id = `cat-${category.id}`;

            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category.name;
            categoryBlock.appendChild(categoryTitle);

            const productGrid = document.createElement('div');
            productGrid.classList.add('product-grid');

            categoryProducts.forEach(prod => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                const cartItem = cart.find(item => item.id === prod.id);
                const isInCart = !!cartItem;

                productCard.innerHTML = `
                    <img src="${prod.image}" alt="${prod.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${prod.name}</h3>
                        <p class="product-unit">${prod.desc || 'Unidade: 1'}</p>
                        <div class="product-price">${formatPrice(prod.price)}</div>
                    </div>
                    ${isInCart ? `
                        <div class="qty-selector">
                            <button class="btn-qty-card" onclick="changeQty(${prod.id}, -1)">
                                ${cartItem.qty === 1 ? '🗑️' : '-'}
                            </button>
                            <span class="card-qty-value">${cartItem.qty}</span>
                            <button class="btn-qty-card" onclick="changeQty(${prod.id}, 1)">+</button>
                        </div>
                    ` : `
                        <button class="btn-add" onclick="addToCart(${prod.id})">
                            Adicionar 🛒
                        </button>
                    `}
                `;
                productGrid.appendChild(productCard);
            });
            categoryBlock.appendChild(productGrid);
            menuSection.appendChild(categoryBlock);
        });
    } else {
        // Se NÃO houver categorias, renderiza todos os produtos em um único grid
        let filteredProducts = products;
        if (query) {
            filteredProducts = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.desc && p.desc.toLowerCase().includes(query))
            );
        }

        if (filteredProducts.length > 0) {
            const productGrid = document.createElement('div');
            productGrid.classList.add('product-grid');

            filteredProducts.forEach(prod => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                const cartItem = cart.find(item => item.id === prod.id);
                const isInCart = !!cartItem;

                productCard.innerHTML = `
                    <img src="${prod.image}" alt="${prod.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${prod.name}</h3>
                        <p class="product-unit">${prod.desc || 'Unidade: 1'}</p>
                        <div class="product-price">${formatPrice(prod.price)}</div>
                    </div>
                    ${isInCart ? `
                        <div class="qty-selector">
                            <button class="btn-qty-card" onclick="changeQty(${prod.id}, -1)">
                                ${cartItem.qty === 1 ? '🗑️' : '-'}
                            </button>
                            <span class="card-qty-value">${cartItem.qty}</span>
                            <button class="btn-qty-card" onclick="changeQty(${prod.id}, 1)">+</button>
                        </div>
                    ` : `
                        <button class="btn-add" onclick="addToCart(${prod.id})">
                            Adicionar 🛒
                        </button>
                    `}
                `;
                productGrid.appendChild(productCard);
            });
            menuSection.appendChild(productGrid);
        }
    }

    if (menuSection.innerHTML === '' && query !== '') {
        menuSection.innerHTML = `
            <div class="no-results">
                <p>Nenhum produto encontrado para "${filterQuery}"</p>
                <button class="btn-secondary" onclick="clearSearch()">Ver todo o cardápio</button>
            </div>
        `;
    }
};

// Renderiza a barra de navegação de categorias
const renderCategoryNav = () => {
    const nav = document.getElementById('category-nav');
    nav.innerHTML = '';

    categories.forEach(cat => {
        const item = document.createElement('a');
        item.classList.add('nav-item');
        if (cat.id === 'ofertas') item.classList.add('bold');

        item.textContent = cat.name.replace(/[^\w\sÀ-ú]/g, '').trim(); // Remove emojis para a barra de nav como no anexo
        item.onclick = () => scrollToCategory(cat.id);

        nav.appendChild(item);
    });
};

// Filtra o menu baseado na busca
const filterMenu = () => {
    const query = document.getElementById('product-search').value;
    renderMenu(query);
};

// Limpa a busca
const clearSearch = () => {
    document.getElementById('product-search').value = '';
    renderMenu();
};

// Rola para a categoria
const scrollToCategory = (catId) => {
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
        const offset = 160; // Compensar header e nav fixa
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Adiciona produto ao carrinho
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
};

// Altera quantidade no carrinho
const changeQty = (productId, delta) => {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;

        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCartUI();
    }
};

// Atualiza a interface do carrinho
const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartCount = document.getElementById('cart-count');
    const floatCount = document.getElementById('floating-cart-count');
    const totalPriceEl = document.getElementById('total-price');

    // Limpa lista
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
        cartSummary.classList.add('hidden');
        cartCount.textContent = '0';
        floatCount.textContent = '0';
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.qty;
        totalPrice += (item.price * item.qty);

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');

        itemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            </div>
            <div class="cart-controls">
                <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                <span class="cart-qty">${item.qty}</span>
                <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemEl);
    });

    cartCount.textContent = totalItems;
    floatCount.textContent = totalItems;

    // Calcula taxas e total
    const deliveryTypeInput = document.querySelector('input[name="delivery-type"]:checked');
    const deliveryType = deliveryTypeInput ? deliveryTypeInput.value : 'entrega';
    const deliveryFee = deliveryType === 'entrega' ? (storeData.deliveryFee || 0) : 0;
    const finalTotal = totalPrice + deliveryFee;

    // Atualiza resumo
    const subtotalEl = document.getElementById('subtotal-price');
    const deliveryFeeRow = document.getElementById('delivery-fee-row');
    const deliveryFeeEl = document.getElementById('delivery-fee-value');

    if (subtotalEl) subtotalEl.textContent = formatPrice(totalPrice);

    if (deliveryFeeRow && deliveryFeeEl) {
        if (deliveryType === 'entrega') {
            deliveryFeeRow.classList.remove('hidden');
            deliveryFeeEl.textContent = formatPrice(deliveryFee);
        } else {
            deliveryFeeRow.classList.add('hidden');
        }
    }

    const floatTotal = document.getElementById('floating-cart-total');
    if (floatTotal) floatTotal.textContent = formatPrice(finalTotal);

    totalPriceEl.textContent = formatPrice(finalTotal);

    cartSummary.classList.remove('hidden');

    // Feedback visual no botão flutuante
    const floatBtn = document.getElementById('floating-cart');
    if (floatBtn) {
        floatBtn.classList.add('pulse');
        setTimeout(() => floatBtn.classList.remove('pulse'), 300);
    }

    // Sincroniza os botões do cardápio
    renderMenu();
};

// Alterna exibição do campo de endereço baseado no tipo de entrega
const toggleAddress = () => {
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const addressGroup = document.getElementById('address-group');
    const addressInput = document.getElementById('customer-address');

    if (deliveryType === 'retirada') {
        addressGroup.classList.add('hidden');
        addressInput.removeAttribute('required');
    } else {
        addressGroup.classList.remove('hidden');
        addressInput.setAttribute('required', 'true');
    }

    // Atualiza o total com/sem taxa de entrega
    updateCartUI();
};

// Envia pedido para o WhatsApp
const sendToWhatsApp = () => {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const name = document.getElementById('customer-name').value.trim();
    if (!name) {
        alert("Por favor, preencha seu nome.");
        document.getElementById('customer-name').focus();
        return;
    }

    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const address = document.getElementById('customer-address').value.trim();

    if (deliveryType === 'entrega' && !address) {
        alert("Por favor, preencha o endereço de entrega.");
        document.getElementById('customer-address').focus();
        return;
    }

    const notes = document.getElementById('order-notes').value.trim();

    // Monta a mensagem
    let message = `*Novo Pedido - ${storeData.name}*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Tipo:* ${deliveryType === 'entrega' ? '🛵 Entrega' : '🏪 Retirada'}\n`;

    if (deliveryType === 'entrega') {
        message += `*Endereço:* ${address}\n`;
    }

    message += `\n*Itens do Pedido:*\n`;

    let subtotal = 0;
    cart.forEach(item => {
        message += `• ${item.qty}x ${item.name} - ${formatPrice(item.price * item.qty)}\n`;
        subtotal += (item.price * item.qty);
    });

    const deliveryFee = deliveryType === 'entrega' ? (storeData.deliveryFee || 0) : 0;
    const total = subtotal + deliveryFee;

    if (deliveryType === 'entrega') {
        message += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;
        message += `*Taxa de Entrega:* ${formatPrice(deliveryFee)}\n`;
    }

    message += `\n*Total do Pedido:* ${formatPrice(total)}\n`;

    if (notes) {
        message += `\n*Observações:* ${notes}\n`;
    }

    // Codifica a mensagem para a URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${storeData.phone}?text=${encodedMessage}`;

    // Redireciona
    window.open(whatsappUrl, '_blank');
};

// Rolar a tela para o carrinho (útil para o botão flutuante mobile)
const scrollToCart = () => {
    document.querySelector('.cart-section').scrollIntoView({ behavior: 'smooth' });
};

// Inicialização
window.onload = () => {
    checkStoreStatus();
    if (categories && categories.length > 0) {
        renderCategoryNav();
    } else {
        const nav = document.getElementById('category-nav');
        if (nav) nav.style.display = 'none';
    }
    renderMenu();
    toggleAddress(); // Ajusta estado inicial do endereço

    // Define a versão no rodapé
    if (document.getElementById('app-version-val')) {
        document.getElementById('app-version-val').textContent = storeData.version || "1.0.0";
    }

    // Atualiza status a cada minuto
    setInterval(checkStoreStatus, 60000);
};

// PWA Installation Logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();

    // Verifica se o usuário está em um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        showInstallPromotion();
    }
});

function showInstallPromotion() {
    // Create a fixed banner at the bottom
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
        <div style="position: fixed; bottom: 100px; left: 10px; right: 10px; background: #4a3728; color: white; padding: 15px; border-radius: 12px; z-index: 1000; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 1px solid rgba(201, 166, 107, 0.3);">
            <div>
                <strong style="display:block;">Instalar Aplicativo</strong>
                <span style="font-size: 0.9em;">Acesse nosso cardápio mais rápido!</span>
            </div>
            <button id="btn-install-pwa" style="background: #c9a66b; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">Instalar</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: white; margin-left: 10px; font-size: 1.5em; line-height: 1;">&times;</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('btn-install-pwa').addEventListener('click', async () => {
        banner.remove();
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
        }
    });
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, (err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
