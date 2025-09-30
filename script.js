document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------
     Toast notification
  ------------------------- */
  const toastEl = document.getElementById('toast');
  function showToast(msg = 'Feito') {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    setTimeout(() => toastEl.style.display = 'none', 1800);
  }

  /* -------------------------
     Cart state
  ------------------------- */
  let cart = JSON.parse(localStorage.getItem('modastyle_cart') || '[]');

  /* -------------------------
     Dark mode toggle
  ------------------------- */
  const btnDark = document.getElementById('btn-dark');
  btnDark.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

  /* -------------------------
     User dropdown
  ------------------------- */
  const btnUser = document.getElementById('btn-user');
  const dropdownUser = document.getElementById('dropdown-user');

  btnUser.addEventListener('click', () => dropdownUser.classList.toggle('hidden'));

  window.addEventListener('click', (e) => {
    if (!e.target.closest('#btn-user') && !e.target.closest('#dropdown-user')) {
      dropdownUser.classList.add('hidden');
    }
  });

  /* -------------------------
     Cart toggle (sidebar)
  ------------------------- */
  const btnCart = document.getElementById('btn-cart');
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');

  btnCart.addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);

  function toggleCart() {
    const opened = !sidebar.classList.contains('translate-x-full');
    if(opened) {
      sidebar.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    } else {
      sidebar.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
    }
  }

});

/* -------------------------
   Search toggle & suggestions
------------------------- */
const btnSearch = document.getElementById('btn-search');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');

btnSearch.addEventListener('click', () => searchBar.classList.toggle('hidden'));

function getAllProducts() {
  return Array.from(document.querySelectorAll('.product-card')).map(card => ({
    id: card.dataset.id,
    name: card.dataset.name,
    price: parseFloat(card.dataset.price),
    img: card.dataset.img
  }));
}

searchInput?.addEventListener('input', () => {
  const q = (searchInput.value || '').toLowerCase().trim();
  const matches = getAllProducts().filter(p => p.name.toLowerCase().includes(q));
  searchSuggestions.innerHTML = matches.map(p => `
    <div class="p-2 border rounded mb-2 flex items-center justify-between">
      <div><strong>${p.name}</strong><div class="text-xs text-gray-500">R$ ${p.price.toFixed(2)}</div></div>
      <button class="px-2 py-1 bg-[color:var(--accent)] text-white rounded-sm add-from-search" data-id="${p.id}">Adicionar</button>
    </div>
  `).join('');
  
  document.querySelectorAll('.add-from-search').forEach(b => b.addEventListener('click', ev => {
    const id = ev.currentTarget.dataset.id;
    addProductToCartById(id);
    searchBar.classList.add('hidden');
  }));
});

/* -------------------------
   Cart: UI & operations
------------------------- */
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const opened = !sidebar.classList.contains('translate-x-full');
  if(opened) {
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
  }
}

function addProductToCartById(id) {
  const prod = getAllProducts().find(p => p.id == id);
  if(!prod) return;
  const existing = cart.find(i => i.id == prod.id);
  if(existing) existing.qty += 1;
  else cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty: 1 });
  persistCart();
  updateCartUI();
  showToast('Produto adicionado ao carrinho ✅');
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.currentTarget.closest('.product-card');
    addProductToCartById(card.dataset.id);
  });
});

function persistCart() {
  localStorage.setItem('modastyle_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  container.innerHTML = '';
  
  if(cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Seu carrinho está vazio</p>';
    totalEl.textContent = 'R$ 0,00';
    countEl.textContent = 0;
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-3';
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md">
        <div class="text-sm">
          <div class="font-medium">${item.name}</div>
          <div class="text-xs text-gray-500">R$ ${item.price.toFixed(2)}</div>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <div class="font-semibold text-[color:var(--accent)]">R$ ${(item.price * item.qty).toFixed(2)}</div>
        <div class="flex items-center gap-2 mt-2">
          <button class="px-2 py-0.5 border change-qty" data-idx="${idx}" data-delta="-1">−</button>
          <div class="px-2">${item.qty}</div>
          <button class="px-2 py-0.5 border change-qty" data-idx="${idx}" data-delta="1">+</button>
          <button class="ml-2 text-red-500 remove-item" data-idx="${idx}">✖</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  // Quantity change & remove
  container.querySelectorAll('.change-qty').forEach(b => {
    b.addEventListener('click', ev => {
      const idx = parseInt(ev.currentTarget.dataset.idx);
      const delta = parseInt(ev.currentTarget.dataset.delta);
      cart[idx].qty += delta;
      if(cart[idx].qty <= 0) cart.splice(idx,1);
      persistCart(); updateCartUI();
    });
  });

  container.querySelectorAll('.remove-item').forEach(b => {
    b.addEventListener('click', ev => {
      const idx = parseInt(ev.currentTarget.dataset.idx);
      cart.splice(idx,1);
      persistCart(); updateCartUI();
    });
  });

  totalEl.textContent = 'R$ ' + total.toFixed(2);
  countEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
}

/* -------------------------
   Wishlist
------------------------- */
function persistWishlist() {
  localStorage.setItem('modastyle_wishlist', JSON.stringify(wishlist));
}

document.querySelectorAll('.add-to-wishlist').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.currentTarget.closest('.product-card');
    const id = card.dataset.id;
    if(wishlist.includes(id)) {
      wishlist = wishlist.filter(x => x !== id);
      e.currentTarget.classList.remove('text-red-500');
      showToast('Removido dos favoritos');
    } else {
      wishlist.push(id);
      e.currentTarget.classList.add('text-red-500');
      showToast('Adicionado aos favoritos ❤️');
    }
    persistWishlist();
  });

  const parentCard = btn.closest('.product-card');
  if(parentCard && wishlist.includes(parentCard.dataset.id)) btn.classList.add('text-red-500');
});

/* -------------------------
   Checkout button
------------------------- */
document.getElementById('checkout-btn').addEventListener('click', () => {
  if(cart.length === 0) { showToast('Carrinho vazio'); return; }
  cart = [];
  persistCart(); updateCartUI();
  showToast('Compra simulada — carrinho limpo ✅');
});

/* -------------------------
   Contact form
------------------------- */
const contactForm = document.getElementById('contact-form');
const contactMsg = document.getElementById('contact-msg');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    nome: contactForm.nome.value.trim(),
    email: contactForm.email.value.trim(),
    senha: contactForm.senha.value.trim(),
    mensagem: contactForm.mensagem.value.trim()
  };
  console.log('Dados do formulário:', data);
  contactMsg.textContent = 'Mensagem enviada com sucesso! ✅';
  contactMsg.classList.add('text-green-600');
  contactForm.reset();
  setTimeout(() => contactMsg.textContent = '', 4000);
});

/* -------------------------
   Accessibility: ESC to close overlays
------------------------- */
window.addEventListener('keydown', e => {
  if(e.key === 'Escape') {
    document.getElementById('cart-sidebar').classList.add('translate-x-full');
    document.getElementById('cart-overlay').classList.add('hidden');
    document.getElementById('search-bar').classList.add('hidden');
    document.getElementById('dropdown-user').classList.add('hidden');
  }
});

document.getElementById('cart-overlay').addEventListener('click', () => {
  document.getElementById('cart-sidebar').classList.add('translate-x-full');
  document.getElementById('cart-overlay').classList.add('hidden');
});

/* -------------------------
   Initialize page
------------------------- */
function init() { updateCartUI(); }
init();
