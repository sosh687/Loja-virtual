
const products = [
  { id:1, nome:'Comenn Bakestrption', cat:'Categoria: G3', preco:120.43, img:'https://picsum.photos/seed/p1/600/400' },
  { id:2, nome:'Brwunt Codes', cat:'Elect 3002', preco:56.99, img:'https://picsum.photos/seed/p2/600/400' },
  { id:3, nome:'But-crete Proteations', cat:'Camis Jonas', preco:34.00, img:'https://picsum.photos/seed/p3/600/400' },
  { id:4, nome:'New Real Look', cat:'Curt. Props', preco:25.29, img:'https://picsum.photos/seed/p4/600/400' },
  { id:5, nome:'Casaco Inverno', cat:'Moda', preco:320.00, img:'https://picsum.photos/seed/p5/600/400' },
  { id:6, nome:'Bolsa de Couro', cat:'Acessórios', preco:199.00, img:'https://picsum.photos/seed/p6/600/400' },
  { id:7, nome:'Camisa Social', cat:'Moda', preco:99.90, img:'https://picsum.photos/seed/p7/600/400' },
  { id:8, nome:'Tênis Esportivo', cat:'Calçados', preco:249.90, img:'https://picsum.photos/seed/p8/600/400' }
];

function renderProducts(){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <div class="name">${p.nome}</div>
      <div class="cat">${p.cat}</div>
      <div class="price">R$ ${p.preco.toFixed(2)}</div>
    `;
    // clique abre alerta (simula adicionar ao carrinho)
    card.addEventListener('click', ()=> {
      alert('Adicionado ao carrinho: ' + p.nome);
    });
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
});
