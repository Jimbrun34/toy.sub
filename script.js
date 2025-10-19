// SPA Navigation
function showPage(page) {
  document.querySelectorAll('.page').forEach(el => el.style.display = 'none');
  if (page === 'beranda') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.getElementById(page + 'Page').style.display = 'block';
  // Special: Hide 'featured-products' and 'featured-categories' if not on Beranda
  document.querySelector('.featured-products').style.display = (page === 'beranda') ? 'block' : 'none';
  document.querySelector('.featured-categories').style.display = (page === 'beranda') ? 'block' : 'none';
  // Show hero only on Beranda
  document.querySelector('.hero-section').style.display = (page === 'beranda') ? 'block' : 'none';
}

// Dummy product data
const products = [
  { id: 1, name: "Ant Man Funko Pop", category: "marvel", price: 850000, rating: 4.9, img: "img/antmanfunkopop.png" },
  { id: 2, name: "Batman Arkham Knight", category: "dc", price: 780000, rating: 4.7, img: "img/batmanfigure.png" },
  { id: 3, name: "Naruto Uzumaki", category: "anime", price: 550000, rating: 4.8, img: "img/narutofigure.png" },
  { id: 4, name: "Darth Vader", category: "starwars", price: 900000, rating: 4.9, img: "img/darthvader.png" },
  { id: 5, name: "Optimus Prime", category: "transformers", price: 1050000, rating: 4.7, img: "img/optimusprime.png" },
  { id: 6, name: "Spider-Man", category: "marvel", price: 650000, rating: 4.6, img: "img/spidermanfunkopop.png" },
  { id: 7, name: "Cat Woman", category: "dc", price: 770000, rating: 4.5, img: "img/catwoman.png" },
  { id: 8, name: "Sasuke Uchiha", category: "anime", price: 630000, rating: 4.7, img: "img/luffyfigure.png" },
  // Tambahkan lebih banyak produk sesuai kebutuhan
];

let wishlist = [];
let cart = [];
let currentCategory = 'all';
let catalogPageSize = 6;
let catalogPageIndex = 1;

// Featured products (pick 4)
function loadFeaturedProducts() {
  const featured = products.slice(0, 4);
  const container = document.getElementById('featuredProducts');
  container.innerHTML = '';
  featured.forEach(prod => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${prod.img}" class="card-img-top" alt="${prod.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text">Rp ${prod.price.toLocaleString()}</p>
            <div class="mt-auto">
              <button class="btn btn-outline-danger btn-sm me-2" onclick="addToWishlist(${prod.id})"><i class="fas fa-heart"></i></button>
              <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})"><i class="fas fa-cart-plus"></i> Beli</button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// Catalog page
function showCatalogList(reset = true) {
  const container = document.getElementById('catalogList');
  let filtered = (currentCategory === 'all')
    ? products
    : products.filter(prod => prod.category === currentCategory);

  // Pagination
  let paged = filtered.slice(0, catalogPageSize * catalogPageIndex);

  container.innerHTML = '';
  if (paged.length === 0) {
    container.innerHTML = `<div class="col-12 text-center">Produk tidak ditemukan.</div>`;
  } else {
    paged.forEach(prod => {
      container.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <img src="${prod.img}" class="card-img-top" alt="${prod.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Rp ${prod.price.toLocaleString()}</p>
              <span class="badge bg-success mb-2"><i class="fas fa-star"></i> ${prod.rating}</span>
              <div class="mt-auto">
                <button class="btn btn-outline-danger btn-sm me-2" onclick="addToWishlist(${prod.id})"><i class="fas fa-heart"></i></button>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})"><i class="fas fa-cart-plus"></i> Beli</button>
              </div>
            </div>
          </div>
        </div>`;
    });
  }
  document.getElementById('loadMoreBtn').style.display = (paged.length < filtered.length) ? 'inline-block' : 'none';
}

// Category filter
function filterCategory(category) {
  currentCategory = category;
  catalogPageIndex = 1;
  showCatalogList();
  // highlight selected button
  document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(category === 'all' ? 'semua' : category)) btn.classList.add('active');
  });
}

// Sort products
function sortProducts() {
  const sort = document.getElementById('sortSelect').value;
  let filtered = (currentCategory === 'all') ? products.slice() : products.filter(prod => prod.category === currentCategory);
  switch (sort) {
    case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
  }
  // Update catalogList with sorted products
  const container = document.getElementById('catalogList');
  container.innerHTML = '';
  filtered.slice(0, catalogPageSize * catalogPageIndex).forEach(prod => {
    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <img src="${prod.img}" class="card-img-top" alt="${prod.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text">Rp ${prod.price.toLocaleString()}</p>
            <span class="badge bg-success mb-2"><i class="fas fa-star"></i> ${prod.rating}</span>
            <div class="mt-auto">
              <button class="btn btn-outline-danger btn-sm me-2" onclick="addToWishlist(${prod.id})"><i class="fas fa-heart"></i></button>
              <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})"><i class="fas fa-cart-plus"></i> Beli</button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// Load more products
function loadMoreProducts() {
  catalogPageIndex++;
  showCatalogList(false);
}

// Search products
function searchProducts() {
  const term = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!term) return showCatalogList();
  const container = document.getElementById('catalogList');
  const results = products.filter(prod =>
    prod.name.toLowerCase().includes(term) ||
    prod.category.toLowerCase().includes(term)
  );
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = `<div class="col-12 text-center">Produk tidak ditemukan.</div>`;
  } else {
    results.forEach(prod => {
      container.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow">
            <img src="${prod.img}" class="card-img-top" alt="${prod.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Rp ${prod.price.toLocaleString()}</p>
              <span class="badge bg-success mb-2"><i class="fas fa-star"></i> ${prod.rating}</span>
              <div class="mt-auto">
                <button class="btn btn-outline-danger btn-sm me-2" onclick="addToWishlist(${prod.id})"><i class="fas fa-heart"></i></button>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})"><i class="fas fa-cart-plus"></i> Beli</button>
              </div>
            </div>
          </div>
        </div>`;
    });
  }
}

// Wishlist
function addToWishlist(id) {
  if (!wishlist.includes(id)) wishlist.push(id);
  updateWishlistCount();
  showWishlistItems();
}

function updateWishlistCount() {
  document.getElementById('wishlistCount').textContent = wishlist.length;
}

function showWishlistItems() {
  const container = document.getElementById('wishlistItems');
  const empty = document.getElementById('wishlistEmpty');
  if (wishlist.length === 0) {
    container.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  container.style.display = 'block';
  empty.style.display = 'none';
  container.innerHTML = '';
  wishlist.forEach(id => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      container.innerHTML += `
        <div class="card mb-3">
          <div class="row g-0 align-items-center">
            <div class="col-md-2"><img src="${prod.img}" class="img-fluid" alt="${prod.name}"></div>
            <div class="col-md-6">
              <h5 class="card-title mb-1">${prod.name}</h5>
              <span class="badge bg-success mb-1"><i class="fas fa-star"></i> ${prod.rating}</span>
              <p class="card-text mb-0">Rp ${prod.price.toLocaleString()}</p>
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-danger btn-sm me-2" onclick="removeFromWishlist(${prod.id})"><i class="fas fa-trash"></i> Hapus</button>
              <button class="btn btn-primary btn-sm" onclick="addToCart(${prod.id})"><i class="fas fa-cart-plus"></i> Beli</button>
            </div>
          </div>
        </div>`;
    }
  });
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(item => item !== id);
  updateWishlistCount();
  showWishlistItems();
}

// Cart
function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartCount();
  showCartItems();
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function showCartItems() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  if (cart.length === 0) {
    container.style.display = 'none';
    empty.style.display = 'block';
    updateCartSummary();
    document.getElementById('checkoutBtn').disabled = true;
    return;
  }
  container.style.display = 'block';
  empty.style.display = 'none';
  container.innerHTML = '';
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) {
      container.innerHTML += `
        <div class="card mb-3">
          <div class="row g-0 align-items-center">
            <div class="col-md-2"><img src="${prod.img}" class="img-fluid" alt="${prod.name}"></div>
            <div class="col-md-6">
              <h5 class="card-title mb-1">${prod.name}</h5>
              <span class="badge bg-success mb-1"><i class="fas fa-star"></i> ${prod.rating}</span>
              <p class="card-text mb-0">Rp ${prod.price.toLocaleString()}</p>
            </div>
            <div class="col-md-4 text-end">
              <div class="input-group mb-2" style="max-width:120px;display:inline-flex;">
                <button class="btn btn-outline-secondary btn-sm" onclick="updateCartQty(${prod.id}, -1)">&minus;</button>
                <span class="input-group-text">${item.qty}</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="updateCartQty(${prod.id}, 1)">&plus;</button>
              </div>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${prod.id})"><i class="fas fa-trash"></i> Hapus</button>
            </div>
          </div>
        </div>`;
    }
  });
  updateCartSummary();
  document.getElementById('checkoutBtn').disabled = false;
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) item.qty = 1;
  updateCartCount();
  showCartItems();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  showCartItems();
}

function updateCartSummary() {
  let subtotal = 0;
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    subtotal += prod.price * item.qty;
  });
  const shipping = subtotal > 500000 ? 0 : 20000;
  const total = subtotal + shipping;
  document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toLocaleString();
  document.getElementById('shipping').textContent = 'Rp ' + shipping.toLocaleString();
  document.getElementById('total').textContent = 'Rp ' + total.toLocaleString();
}

function proceedToCheckout() {
  if (cart.length === 0) return;
  alert('Checkout berhasil! Terima kasih sudah belanja di ActionFigureHub.');
  cart = [];
  updateCartCount();
  showCartItems();
}

// Contact form
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contactForm').onsubmit = function(e) {
    e.preventDefault();
    document.getElementById('contactSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('contactSuccess').style.display = 'none';
    }, 4000);
    this.reset();
  };

  // Newsletter
  document.getElementById('newsletterForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Terima kasih telah berlangganan newsletter!');
    this.reset();
  };

  // Initial page load
  showPage('beranda');
  loadFeaturedProducts();
  showCatalogList();
  updateWishlistCount();
  updateCartCount();
  showWishlistItems();
  showCartItems();
  // Back to top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
  backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Allow navigation from footer/social/other links
  document.querySelectorAll('[onclick*="showPage"]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });
});


// Show wishlist page handler
window.showWishlistItems = showWishlistItems;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.showCartItems = showCartItems;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQty = updateCartQty;
window.filterCategory = filterCategory;
window.showPage = showPage;
window.searchProducts = searchProducts;
window.loadMoreProducts = loadMoreProducts;
window.sortProducts = sortProducts;
window.proceedToCheckout = proceedToCheckout;