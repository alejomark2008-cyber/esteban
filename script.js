const products = [
  {id:1,name:"Pijama corazones",category:"pajama",price:89900,emoji:"🎀",desc:"Suave y cómoda para descansar.",badge:"Más vendido"},
  {id:2,name:"Pijama gatitos",category:"pajama",price:89900,emoji:"🐱",desc:"Un clásico para noches acogedoras.",badge:"Más vendido"},
  {id:3,name:"Pijama espacio",category:"pajama",price:89900,emoji:"🚀",desc:"Estilo divertido y cómodo.",badge:"Nuevo"},
  {id:4,name:"Pijama ositos",category:"pajama",price:94900,emoji:"🧸",desc:"Calientita y adorable.",badge:"Favorito"},
  {id:5,name:"Yeti oversized negro",category:"yeti",price:109900,emoji:"🖤",desc:"Extra grande y muy abrigado.",badge:"Más vendido"},
  {id:6,name:"Yeti oversized lila",category:"yeti",price:109900,emoji:"💜",desc:"Suave, amplio y calientito.",badge:"Más vendido"},
  {id:7,name:"Yeti oversized crema",category:"yeti",price:114900,emoji:"🤍",desc:"Tu nuevo refugio contra el frío.",badge:"Nuevo"},
  {id:8,name:"Yeti oversized rosa",category:"yeti",price:109900,emoji:"🩷",desc:"Comodidad en versión oversized.",badge:"Favorito"},
  {id:9,name:"Pijama pastel",category:"new",price:94900,emoji:"🌸",desc:"Nuevo estilo para descansar.",badge:"Nuevo"},
  {id:10,name:"Set comfy nube",category:"new",price:99900,emoji:"☁️",desc:"Ligero, suave y relajado.",badge:"Nuevo"},
  {id:11,name:"Pijama estrellas",category:"new",price:92900,emoji:"⭐",desc:"Un look para noches especiales.",badge:"Nuevo"},
  {id:12,name:"Set cozy lavanda",category:"new",price:104900,emoji:"🪻",desc:"Color y comodidad.",badge:"Nuevo"}
];

let cart = JSON.parse(localStorage.getItem("cozystyle_cart") || "[]");
let favorites = JSON.parse(localStorage.getItem("cozystyle_favorites") || "[]");

const money = value => "$" + value.toLocaleString("es-CO");
const save = () => {
  localStorage.setItem("cozystyle_cart", JSON.stringify(cart));
  localStorage.setItem("cozystyle_favorites", JSON.stringify(favorites));
};

function card(p){
  const fav = favorites.includes(p.id);
  return `<article class="product-card">
    <div class="product-image">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      <button class="heart ${fav ? "active":""}" onclick="toggleFavorite(${p.id})">${fav ? "♥":"♡"}</button>
      <span>${p.emoji}</span>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}</div>
      <div class="product-actions">
        <button class="add-btn" onclick="addToCart(${p.id})">🛒 Agregar al carrito</button>
        <button class="fav-btn" onclick="toggleFavorite(${p.id})">${fav ? "♥":"♡"}</button>
      </div>
    </div>
  </article>`;
}

function render(id, list){ document.getElementById(id).innerHTML = list.map(card).join(""); }
function renderProducts(){
  render("pajamaGrid", products.filter(p=>p.category==="pajama"));
  render("yetiGrid", products.filter(p=>p.category==="yeti"));
  render("newGrid", products.filter(p=>p.category==="new"));
  render("bestGrid", products.filter(p=>[1,2,5,6].includes(p.id)));
}
function updateCart(){
  document.getElementById("cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById("cartItems");
  if(!cart.length){ el.innerHTML='<div class="empty">Tu carrito está vacío.<br>¡Agrega algo que te encante! ♡</div>'; }
  else el.innerHTML = cart.map(i=>{
    const p=products.find(x=>x.id===i.id);
    return `<div class="cart-row">
      <div class="cart-thumb">${p.emoji}</div>
      <div><h4>${p.name}</h4><small>${money(p.price)}</small>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
        <button class="remove" onclick="removeFromCart(${p.id})">Eliminar</button>
      </div>
      <strong>${money(p.price*i.qty)}</strong>
    </div>`;
  }).join("");
  const total=cart.reduce((s,i)=>s+i.qty*products.find(p=>p.id===i.id).price,0);
  document.getElementById("cartTotal").textContent=money(total);
}
function addToCart(id){
  const item=cart.find(i=>i.id===id);
  item ? item.qty++ : cart.push({id,qty:1});
  save(); updateCart(); openCart();
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  save(); updateCart();
}
function removeFromCart(id){cart=cart.filter(i=>i.id!==id);save();updateCart();}
function toggleFavorite(id){
  favorites.includes(id) ? favorites=favorites.filter(x=>x!==id) : favorites.push(id);
  save(); renderProducts();
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){alert("Tu carrito está vacío.");return}
  document.getElementById("checkoutModal").classList.add("show");
};
document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("checkoutForm").onsubmit=(e)=>{
  e.preventDefault();
  alert("¡Pedido simulado! En la versión final conectaremos este formulario con el método de pago y la gestión real de pedidos.");
  cart=[]; save(); updateCart();
  document.getElementById("checkoutModal").classList.remove("show"); closeCart();
};
document.getElementById("favoritesBtn").onclick=()=>{
  const first=favorites.length ? products.find(p=>p.id===favorites[0]) : null;
  if(first) document.getElementById(first.category==="pajama"?"pijamas":first.category==="yeti"?"yetis":"nuevos").scrollIntoView({behavior:"smooth"});
  else alert("Todavía no tienes favoritos. Pulsa ♡ en un producto para guardarlo.");
};
document.getElementById("searchBtn").onclick=()=>alert("La búsqueda estará disponible en la siguiente versión.");

renderProducts(); updateCart();
