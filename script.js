const db = {
    products: [
      { id: 1, name: "Vestido Midi Elegante", price: 199.90, img: "https://via.placeholder.com/250x300" },
      { id: 2, name: "Bolsa de Couro", price: 249.90, img: "https://via.placeholder.com/250x300" },
      { id: 3, name: "Casaco de Inverno", price: 349.90, img: "https://via.placeholder.com/250x300" },
      { id: 4, name: "Sapato Social", price: 179.90, img: "https://via.placeholder.com/250x300" }
    ],
    cart: []
  };
  
  function renderProducts() {
    const container = document.getElementById("products-list");
    container.innerHTML = "";
    db.products.forEach(p => {
      const card = document.createElement("div");
      card.className = "produto";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="preco">R$ ${p.price.toFixed(2)}</p>
        <button onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      `;
      container.appendChild(card);
    });
  }
  
  // Adicionar ao carrinho
  function addToCart(productId) {
    const product = db.products.find(p => p.id === productId);
    const item = db.cart.find(i => i.id === productId);
  
    if (item) {
      item.quantity++;
    } else {
      db.cart.push({ ...product, quantity: 1 });
    }
  
    updateCart();
  }
  
  function updateCart() {
    const container = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
  
    container.innerHTML = "";
    let total = 0;
  
    db.cart.forEach(item => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        ${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}
      `;
      container.appendChild(div);
    });
  
    cartCount.innerText = db.cart.reduce((sum, i) => sum + i.quantity, 0);
    cartTotal.innerText = total.toFixed(2);
  }
  
  function checkout() {
    if (db.cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    alert("Pedido finalizado com sucesso!");
    db.cart = [];
    updateCart();
  }
  
  renderProducts();
  updateCart();
  