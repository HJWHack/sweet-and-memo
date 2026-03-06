import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

/* ─────────────────────────── CONSTANTS & DATA ─────────────────────────── */
const ADMIN_PASS = "dafne2026";
const DELIVERY_FEE = 8.00;
const STORAGE_KEY = "sweetmemo-products";
const ORDERS_KEY = "sweetmemo-orders";
const LOGO_URL = "/logo.png";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Classic Vanilla Dream", category: "Cakes", price: 45.00, description: "A light & fluffy vanilla sponge layered with fresh cream and seasonal berries. Perfect for birthdays!", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", available: true },
  { id: 2, name: "Chocolate Fudge Delight", category: "Cakes", price: 50.00, description: "Rich triple-layer chocolate cake with silky ganache frosting. A chocoholic's paradise.", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80", available: true },
  { id: 3, name: "Strawberry Bliss Cake", category: "Cakes", price: 55.00, description: "Delicate strawberry sponge with fresh strawberry compote and whipped cream layers.", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80", available: true },
  { id: 4, name: "Lemon Drizzle Sunshine", category: "Cakes", price: 40.00, description: "Zingy lemon cake with a sweet lemon glaze — sunshine in every bite!", image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80", available: true },
  { id: 5, name: "Red Velvet Romance", category: "Cakes", price: 52.00, description: "Gorgeous red velvet layers with tangy cream cheese frosting. An elegant showstopper.", image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80", available: true },
  { id: 6, name: "Assorted Cupcake Box (6)", category: "Cupcakes", price: 24.00, description: "Six beautifully frosted cupcakes in assorted flavors — vanilla, chocolate & strawberry.", image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80", available: true },
  { id: 7, name: "Salted Caramel Cupcakes (6)", category: "Cupcakes", price: 26.00, description: "Decadent salted caramel cupcakes with caramel drizzle and a pinch of sea salt.", image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80", available: true },
  { id: 8, name: "Chocolate Chip Cookies (12)", category: "Cookies", price: 18.00, description: "Classic chewy chocolate chip cookies, baked fresh with real butter and premium chocolate.", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80", available: true },
  { id: 9, name: "Macarons Collection (12)", category: "Cookies", price: 30.00, description: "Delicate French macarons in pastel colors — rose, pistachio, vanilla, lavender & more.", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80", available: true },
  { id: 10, name: "Cake Pops Party Pack (10)", category: "Treats", price: 22.00, description: "Fun bite-sized cake pops dipped in candy coating. Great for parties and gifts!", image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80", available: true },
  { id: 11, name: "Tiramisu Cup", category: "Treats", price: 12.00, description: "Individual tiramisu cups with espresso-soaked sponge and mascarpone cream.", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", available: true },
  { id: 12, name: "Custom Celebration Cake", category: "Custom", price: 85.00, description: "A bespoke cake designed to your vision. Contact us to discuss your dream cake!", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12f4f?w=600&q=80", available: true },
];

/* ─────────────────────────── CONTEXT ─────────────────────────── */
const AppContext = createContext();

/* ─────────────────────────── STORAGE HELPERS ─────────────────────────── */
const loadFromStorage = async (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const saveToStorage = async (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Storage save error:", e); }
};

/* ─────────────────────────── STYLES ─────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Quicksand:wght@300;400;500;600;700&display=swap');

:root {
  --rose: #E4637A;
  --rose-light: #F5A0B0;
  --rose-lighter: #FFF0F3;
  --rose-dark: #C94D64;
  --cream: #FDF8F0;
  --cream-dark: #F5EDE0;
  --brown: #3D2B2B;
  --brown-light: #6B5454;
  --brown-lighter: #9E8888;
  --white: #FFFFFF;
  --shadow: 0 2px 20px rgba(228,99,122,0.10);
  --shadow-lg: 0 8px 40px rgba(228,99,122,0.15);
  --radius: 16px;
  --radius-sm: 10px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Quicksand', sans-serif;
  background: var(--cream);
  color: var(--brown);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* SCALLOP DECORATION */
.scallop-divider {
  width: 100%; height: 24px;
  background: radial-gradient(circle at 12px -6px, transparent 12px, var(--rose-lighter) 13px);
  background-size: 24px 24px;
  background-position: 0 0;
}

/* ANIMATIONS */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes heartBeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.25); }
  30% { transform: scale(1); }
  45% { transform: scale(1.15); }
  60% { transform: scale(1); }
}
.animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
.animate-slide-right { animation: slideRight 0.5s ease-out forwards; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--rose-light); border-radius: 4px; }

/* HEADER */
.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(253,248,240,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(228,99,122,0.12);
  padding: 0 32px;
  transition: var(--transition);
}
.header-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  height: 72px;
}
.header-logo { height: 112px; cursor: pointer; transition: var(--transition); }
.header-logo:hover { transform: scale(1.05); }

.nav-links {
  display: flex; align-items: center; gap: 8px; list-style: none;
}
.nav-link {
  padding: 8px 18px; border-radius: 24px;
  font-weight: 600; font-size: 14px; letter-spacing: 0.3px;
  color: var(--brown-light); cursor: pointer;
  transition: var(--transition); border: none; background: none;
  font-family: 'Quicksand', sans-serif;
  position: relative;
}
.nav-link:hover { color: var(--rose); background: var(--rose-lighter); }
.nav-link.active { color: var(--white); background: var(--rose); }
.cart-btn {
  position: relative; display: flex; align-items: center; gap: 6px;
}
.cart-badge {
  position: absolute; top: -4px; right: -4px;
  background: var(--rose); color: white;
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  animation: scaleIn 0.3s ease-out;
}

/* HERO */
.hero {
  min-height: 80vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 60px 32px;
  position: relative; overflow: hidden;
  background: linear-gradient(160deg, var(--cream) 0%, var(--rose-lighter) 50%, var(--cream) 100%);
}
.hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 20% 80%, rgba(228,99,122,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(228,99,122,0.06) 0%, transparent 50%);
}
.hero-content { position: relative; z-index: 1; max-width: 680px; }
.hero-logo { width: 400px; margin-bottom: 32px; animation: float 3s ease-in-out infinite; }
.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: 52px; font-weight: 700;
  color: var(--brown); margin-bottom: 16px;
  line-height: 1.15;
}
.hero h1 span { color: var(--rose); font-style: italic; }
.hero p {
  font-size: 18px; color: var(--brown-light);
  line-height: 1.7; margin-bottom: 36px; font-weight: 400;
}
.hero-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 16px 40px; background: var(--rose);
  color: white; border: none; border-radius: 50px;
  font-size: 16px; font-weight: 600; cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  transition: var(--transition);
  box-shadow: 0 4px 24px rgba(228,99,122,0.35);
}
.hero-btn:hover {
  background: var(--rose-dark); transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(228,99,122,0.45);
}

/* FLOATING DECORATIONS */
.deco {
  position: absolute; font-size: 32px; opacity: 0.15;
  animation: float 4s ease-in-out infinite;
  pointer-events: none;
}

/* SECTIONS */
.section {
  max-width: 1200px; margin: 0 auto;
  padding: 80px 32px;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 700;
  text-align: center; margin-bottom: 12px;
  color: var(--brown);
}
.section-title span { color: var(--rose); font-style: italic; }
.section-subtitle {
  text-align: center; color: var(--brown-lighter);
  font-size: 16px; margin-bottom: 48px; font-weight: 400;
}

/* CATEGORY FILTER */
.category-bar {
  display: flex; justify-content: center; gap: 8px;
  margin-bottom: 40px; flex-wrap: wrap;
}
.cat-btn {
  padding: 10px 24px; border-radius: 50px;
  border: 2px solid var(--rose-light);
  background: white; color: var(--brown-light);
  font-family: 'Quicksand', sans-serif;
  font-weight: 600; font-size: 14px;
  cursor: pointer; transition: var(--transition);
}
.cat-btn:hover { border-color: var(--rose); color: var(--rose); }
.cat-btn.active {
  background: var(--rose); color: white;
  border-color: var(--rose);
}

/* PRODUCT GRID */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}
.product-card {
  background: white; border-radius: var(--radius);
  overflow: hidden; box-shadow: var(--shadow);
  transition: var(--transition); cursor: pointer;
  animation: fadeUp 0.5s ease-out forwards;
  opacity: 0;
  position: relative;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}
.product-card-img {
  width: 100%; height: 220px;
  object-fit: cover;
  transition: var(--transition);
}
.product-card:hover .product-card-img { transform: scale(1.05); }
.product-card-img-wrap { overflow: hidden; position: relative; }
.product-card-badge {
  position: absolute; top: 12px; left: 12px;
  background: var(--rose); color: white;
  padding: 4px 14px; border-radius: 50px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
}
.product-card-body { padding: 20px; }
.product-card-cat {
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: var(--rose); margin-bottom: 6px;
}
.product-card-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px; font-weight: 600;
  margin-bottom: 8px; color: var(--brown);
}
.product-card-desc {
  font-size: 13.5px; color: var(--brown-lighter);
  line-height: 1.6; margin-bottom: 16px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.product-card-footer {
  display: flex; align-items: center; justify-content: space-between;
}
.product-card-price {
  font-family: 'Playfair Display', serif;
  font-size: 22px; font-weight: 700; color: var(--rose);
}
.add-btn {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--rose); color: white; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--transition);
  font-size: 20px;
}
.add-btn:hover { background: var(--rose-dark); transform: scale(1.1); }
.unavailable { opacity: 0.55; pointer-events: none; }
.unavailable-tag {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  background: rgba(61,43,43,0.85); color: white;
  padding: 8px 24px; border-radius: 50px;
  font-weight: 700; font-size: 14px; z-index: 2;
}

/* CART SIDEBAR */
.cart-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(61,43,43,0.3);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.25s ease-out;
}
.cart-panel {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 420px; max-width: 100vw;
  background: white; z-index: 201;
  display: flex; flex-direction: column;
  animation: slideRight 0.35s ease-out;
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
}
.cart-header {
  padding: 24px; border-bottom: 1px solid var(--cream-dark);
  display: flex; align-items: center; justify-content: space-between;
}
.cart-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 24px; color: var(--brown);
}
.cart-close {
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: var(--cream);
  cursor: pointer; font-size: 18px; color: var(--brown);
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.cart-close:hover { background: var(--rose-lighter); color: var(--rose); }
.cart-items { flex: 1; overflow-y: auto; padding: 16px 24px; }
.cart-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; color: var(--brown-lighter);
  text-align: center; gap: 12px;
}
.cart-empty-icon { font-size: 56px; opacity: 0.4; }
.cart-item {
  display: flex; gap: 14px; padding: 16px 0;
  border-bottom: 1px solid var(--cream-dark);
  animation: fadeUp 0.3s ease-out;
}
.cart-item-img {
  width: 72px; height: 72px; border-radius: var(--radius-sm);
  object-fit: cover; flex-shrink: 0;
}
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name {
  font-weight: 600; font-size: 14px;
  margin-bottom: 4px; color: var(--brown);
}
.cart-item-price {
  font-size: 13px; color: var(--rose); font-weight: 600;
}
.cart-qty {
  display: flex; align-items: center; gap: 10px; margin-top: 8px;
}
.cart-qty button {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1.5px solid var(--cream-dark);
  background: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--brown); transition: var(--transition);
}
.cart-qty button:hover { border-color: var(--rose); color: var(--rose); }
.cart-qty span { font-weight: 700; font-size: 14px; min-width: 20px; text-align: center; }
.cart-remove {
  background: none; border: none; color: var(--brown-lighter);
  cursor: pointer; font-size: 12px; margin-top: 4px;
  font-family: 'Quicksand', sans-serif; font-weight: 600;
  transition: var(--transition);
}
.cart-remove:hover { color: var(--rose); }
.cart-footer {
  padding: 24px; border-top: 1px solid var(--cream-dark);
  background: var(--cream);
}
.cart-total {
  display: flex; justify-content: space-between;
  font-size: 18px; font-weight: 700; margin-bottom: 16px;
}
.cart-total span:last-child {
  font-family: 'Playfair Display', serif;
  color: var(--rose); font-size: 22px;
}
.checkout-btn {
  width: 100%; padding: 16px; border: none;
  background: var(--rose); color: white;
  border-radius: 50px; font-size: 16px;
  font-weight: 700; cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  transition: var(--transition);
  box-shadow: 0 4px 20px rgba(228,99,122,0.3);
}
.checkout-btn:hover {
  background: var(--rose-dark); transform: translateY(-1px);
}

/* CHECKOUT */
.checkout-page {
  max-width: 640px; margin: 0 auto; padding: 40px 32px 80px;
  animation: fadeUp 0.5s ease-out;
}
.checkout-page h2 {
  font-family: 'Playfair Display', serif;
  font-size: 32px; margin-bottom: 32px; text-align: center;
}
.form-group { margin-bottom: 20px; }
.form-label {
  display: block; font-weight: 600; font-size: 13px;
  margin-bottom: 6px; color: var(--brown);
  letter-spacing: 0.3px;
}
.form-input {
  width: 100%; padding: 14px 18px;
  border: 2px solid var(--cream-dark);
  border-radius: var(--radius-sm);
  font-family: 'Quicksand', sans-serif;
  font-size: 15px; color: var(--brown);
  transition: var(--transition); background: white;
}
.form-input:focus {
  outline: none; border-color: var(--rose);
  box-shadow: 0 0 0 3px rgba(228,99,122,0.12);
}
.form-input::placeholder { color: var(--brown-lighter); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.delivery-toggle {
  display: flex; gap: 12px; margin-bottom: 24px;
}
.delivery-opt {
  flex: 1; padding: 18px; border: 2px solid var(--cream-dark);
  border-radius: var(--radius); cursor: pointer;
  text-align: center; transition: var(--transition);
  background: white;
}
.delivery-opt:hover { border-color: var(--rose-light); }
.delivery-opt.selected {
  border-color: var(--rose); background: var(--rose-lighter);
}
.delivery-opt-icon { font-size: 28px; margin-bottom: 6px; display: block; }
.delivery-opt-label { font-weight: 700; font-size: 14px; color: var(--brown); }
.delivery-opt-sub { font-size: 12px; color: var(--brown-lighter); margin-top: 2px; }

.order-summary {
  background: white; border-radius: var(--radius);
  padding: 24px; margin-bottom: 24px;
  box-shadow: var(--shadow);
}
.order-summary h3 {
  font-family: 'Playfair Display', serif;
  font-size: 20px; margin-bottom: 16px;
}
.order-line {
  display: flex; justify-content: space-between;
  padding: 8px 0; font-size: 14px;
  border-bottom: 1px solid var(--cream);
}
.order-line:last-child { border: none; }
.order-line.total {
  font-weight: 700; font-size: 18px; padding-top: 12px;
  margin-top: 4px; border-top: 2px solid var(--cream-dark); border-bottom: none;
}
.order-line.total span:last-child {
  color: var(--rose); font-family: 'Playfair Display', serif;
}

/* STRIPE CARD MOCK */
.stripe-card {
  border: 2px solid var(--cream-dark); border-radius: var(--radius-sm);
  padding: 18px; background: white;
  margin-bottom: 24px; position: relative;
}
.stripe-card::after {
  content: '🔒 Secured by Stripe'; position: absolute;
  bottom: -22px; right: 0; font-size: 11px;
  color: var(--brown-lighter); font-weight: 600;
}
.stripe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }

.pay-btn {
  width: 100%; padding: 18px; border: none;
  background: var(--rose); color: white;
  border-radius: 50px; font-size: 17px;
  font-weight: 700; cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  transition: var(--transition);
  box-shadow: 0 4px 24px rgba(228,99,122,0.35);
  margin-top: 32px;
}
.pay-btn:hover { background: var(--rose-dark); transform: translateY(-2px); }
.pay-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* SUCCESS */
.success-page {
  min-height: 70vh; display: flex; align-items: center;
  justify-content: center; text-align: center; padding: 40px;
  animation: fadeUp 0.5s ease-out;
}
.success-icon { font-size: 72px; margin-bottom: 24px; animation: heartBeat 1.2s ease-in-out; }
.success-page h2 {
  font-family: 'Playfair Display', serif;
  font-size: 36px; margin-bottom: 12px;
}
.success-page p { color: var(--brown-lighter); font-size: 16px; margin-bottom: 32px; line-height: 1.7; }
.success-order-id {
  display: inline-block; background: var(--rose-lighter);
  padding: 8px 24px; border-radius: 50px;
  font-weight: 700; color: var(--rose); font-size: 14px;
  margin-bottom: 32px;
}

/* ADMIN */
.admin-login {
  max-width: 400px; margin: 80px auto; padding: 40px;
  background: white; border-radius: var(--radius);
  box-shadow: var(--shadow-lg); text-align: center;
  animation: scaleIn 0.4s ease-out;
}
.admin-login h2 {
  font-family: 'Playfair Display', serif;
  font-size: 28px; margin-bottom: 8px;
}
.admin-login p { color: var(--brown-lighter); margin-bottom: 24px; font-size: 14px; }

.admin-page { max-width: 1000px; margin: 0 auto; padding: 32px; }
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
}
.admin-header h2 { font-family: 'Playfair Display', serif; font-size: 28px; }
.admin-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
.admin-tab {
  padding: 10px 24px; border-radius: 50px;
  border: 2px solid var(--cream-dark); background: white;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600; font-size: 14px;
  cursor: pointer; transition: var(--transition);
  color: var(--brown-light);
}
.admin-tab.active { background: var(--rose); color: white; border-color: var(--rose); }
.admin-product-row {
  display: flex; align-items: center; gap: 16px;
  padding: 16px; background: white;
  border-radius: var(--radius-sm); margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  transition: var(--transition);
}
.admin-product-row:hover { box-shadow: var(--shadow); }
.admin-product-img {
  width: 64px; height: 64px; border-radius: 10px;
  object-fit: cover; flex-shrink: 0;
}
.admin-product-info { flex: 1; min-width: 0; }
.admin-product-name { font-weight: 700; font-size: 15px; }
.admin-product-meta { font-size: 12px; color: var(--brown-lighter); }
.admin-product-price { font-weight: 700; color: var(--rose); font-size: 16px; min-width: 60px; text-align: right; }
.admin-actions { display: flex; gap: 8px; }
.admin-btn {
  padding: 8px 16px; border-radius: 50px;
  border: none; font-family: 'Quicksand', sans-serif;
  font-weight: 600; font-size: 12px;
  cursor: pointer; transition: var(--transition);
}
.admin-btn-edit { background: var(--cream); color: var(--brown); }
.admin-btn-edit:hover { background: var(--rose-lighter); color: var(--rose); }
.admin-btn-delete { background: #fde8e8; color: #c53030; }
.admin-btn-delete:hover { background: #fed7d7; }
.admin-btn-toggle { background: var(--cream); color: var(--brown-lighter); }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(61,43,43,0.4);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; animation: fadeIn 0.2s ease-out;
}
.modal {
  background: white; border-radius: var(--radius);
  padding: 32px; width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: scaleIn 0.3s ease-out;
}
.modal h3 {
  font-family: 'Playfair Display', serif;
  font-size: 24px; margin-bottom: 24px;
}

/* ORDERS TABLE */
.order-card {
  background: white; border-radius: var(--radius-sm);
  padding: 20px; margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
}
.order-card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
}
.order-id { font-weight: 700; color: var(--rose); font-size: 14px; }
.order-date { font-size: 12px; color: var(--brown-lighter); }
.order-status {
  padding: 4px 12px; border-radius: 50px;
  font-size: 11px; font-weight: 700;
}
.status-new { background: #E8F5E9; color: #2E7D32; }
.status-done { background: var(--cream); color: var(--brown-lighter); }
.order-items-list { font-size: 13px; color: var(--brown-light); margin-bottom: 8px; }
.order-customer { font-size: 12px; color: var(--brown-lighter); }

/* FOOTER */
.footer {
  background: var(--brown); color: rgba(255,255,255,0.7);
  text-align: center; padding: 48px 32px;
  margin-top: 40px;
}
.footer-logo { height: 96px; margin-bottom: 16px; filter: brightness(2); opacity: 0.6; }
.footer p { font-size: 13px; line-height: 2; }
.footer a { color: var(--rose-light); text-decoration: none; }
.footer-admin-link {
  display: inline-block; margin-top: 16px;
  background: none; border: none; color: rgba(255,255,255,0.25);
  font-family: 'Quicksand', sans-serif;
  font-size: 11px; cursor: pointer;
  transition: var(--transition); letter-spacing: 0.5px;
}
.footer-admin-link:hover { color: rgba(255,255,255,0.55); }

/* IMAGE UPLOAD */
.img-upload-zone {
  border: 2px dashed var(--rose-light);
  border-radius: var(--radius-sm);
  padding: 24px; text-align: center;
  cursor: pointer; transition: var(--transition);
  background: var(--cream);
  position: relative;
}
.img-upload-zone:hover, .img-upload-zone.dragging {
  border-color: var(--rose); background: var(--rose-lighter);
}
.img-upload-zone input[type="file"] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer;
}
.img-upload-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.5; }
.img-upload-text { font-size: 13px; color: var(--brown-lighter); font-weight: 500; }
.img-upload-text strong { color: var(--rose); }
.img-upload-preview {
  position: relative; display: inline-block;
}
.img-upload-preview img {
  width: 100%; max-height: 200px; object-fit: cover;
  border-radius: var(--radius-sm);
}
.img-upload-remove {
  position: absolute; top: 8px; right: 8px;
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(61,43,43,0.7); color: white;
  border: none; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.img-upload-remove:hover { background: var(--rose); }

/* TOAST */
.toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: var(--brown); color: white;
  padding: 14px 28px; border-radius: 50px;
  font-weight: 600; font-size: 14px; z-index: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  animation: fadeUp 0.3s ease-out;
  display: flex; align-items: center; gap: 8px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero h1 { font-size: 34px; }
  .hero-logo { width: 150px; }
  .header-inner { padding: 0 16px; }
  .nav-links { gap: 2px; }
  .nav-link { padding: 8px 12px; font-size: 12px; }
  .cart-panel { width: 100%; }
  .section { padding: 48px 16px; }
  .form-row { grid-template-columns: 1fr; }
  .products-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
  .admin-product-row { flex-wrap: wrap; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
}
`;

/* ─────────────────────────── ICONS (inline SVG) ─────────────────────────── */
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const MinusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const BackIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;

/* ─────────────────────────── TOAST ─────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast">🧁 {message}</div>;
}

/* ─────────────────────────── HEADER ─────────────────────────── */
function Header({ page, setPage, cartCount, openCart }) {
  return (
    <header className="header">
      <div className="header-inner">
        <nav>
          <ul className="nav-links">
            <li><button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</button></li>
            <li><button className={`nav-link ${page === "shop" ? "active" : ""}`} onClick={() => setPage("shop")}>Shop</button></li>
            <li>
              <button className="nav-link cart-btn" onClick={openCart}>
                <CartIcon /> Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */
function Hero({ goShop }) {
  return (
    <section className="hero">
      <div className="deco" style={{ top: "15%", left: "8%" }}>🧁</div>
      <div className="deco" style={{ top: "25%", right: "10%", animationDelay: "1s" }}>🍰</div>
      <div className="deco" style={{ bottom: "20%", left: "12%", animationDelay: "2s" }}>🍪</div>
      <div className="deco" style={{ bottom: "15%", right: "8%", animationDelay: "0.5s" }}>🎂</div>
      <div className="deco" style={{ top: "60%", left: "25%", animationDelay: "1.5s" }}>💖</div>
      <div className="hero-content animate-fade-up">
        <img src={LOGO_URL} alt="Sweet & Memo" className="hero-logo" />
        <h1>Homemade Treats<br />Baked with <span>Love</span></h1>
        <p>
          Welcome to Sweet & Memo! Every cake, cupcake and cookie is handcrafted by Dafne
          using the finest ingredients and a whole lot of love. Order your perfect treat for
          pickup or delivery today.
        </p>
        <button className="hero-btn" onClick={goShop}>
          🛒 Browse Our Treats
        </button>
      </div>
    </section>
  );
}

/* ─────────────────────────── PRODUCT CARD ─────────────────────────── */
function ProductDetailModal({ product, onAdd, onClose }) {
  const available = product.available;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <img src={product.image} alt={product.name}
          style={{ width: "100%", borderRadius: "var(--radius-sm)", marginBottom: 20, maxHeight: 320, objectFit: "cover" }}
          onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23FFF0F3' width='400' height='300'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%23E4637A' font-size='48'%3E🧁%3C/text%3E%3C/svg%3E"; }}
        />
        <div style={{ fontSize: 12, color: "var(--brown-lighter)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{product.category}</div>
        <h3 style={{ marginBottom: 10 }}>{product.name}</h3>
        <p style={{ color: "var(--brown-lighter)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>{product.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--rose)" }}>${product.price.toFixed(2)}</span>
          {available ? (
            <button className="hero-btn" onClick={() => { onAdd(product); onClose(); }}>Add to Cart</button>
          ) : (
            <span style={{ color: "#c53030", fontWeight: 600 }}>Sold Out</span>
          )}
        </div>
        <button onClick={onClose} style={{ marginTop: 16, background: "none", border: "none", color: "var(--brown-lighter)", cursor: "pointer", fontSize: 13, padding: 0 }}>Close</button>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd, delay }) {
  const [open, setOpen] = useState(false);
  const available = product.available;
  return (
    <>
      <div className={`product-card ${!available ? "unavailable" : ""}`} style={{ animationDelay: `${delay}ms`, cursor: "pointer" }} onClick={() => setOpen(true)}>
        {!available && <div className="unavailable-tag">Sold Out</div>}
        <div className="product-card-img-wrap">
          {product.category === "Custom" && <div className="product-card-badge">Custom</div>}
          <img src={product.image} alt={product.name} className="product-card-img" loading="lazy"
            onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23FFF0F3' width='400' height='300'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%23E4637A' font-size='48'%3E🧁%3C/text%3E%3C/svg%3E"; }}
          />
        </div>
        <div className="product-card-body">
          <div className="product-card-cat">{product.category}</div>
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-desc">{product.description}</div>
          <div className="product-card-footer">
            <span className="product-card-price">${product.price.toFixed(2)}</span>
            {available && (
              <button className="add-btn" onClick={(e) => { e.stopPropagation(); onAdd(product); }} title="Add to cart">
                <PlusIcon />
              </button>
            )}
          </div>
        </div>
      </div>
      {open && <ProductDetailModal product={product} onAdd={onAdd} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ─────────────────────────── SHOP PAGE ─────────────────────────── */
function ShopPage({ products, onAdd }) {
  const [cat, setCat] = useState("All");
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = cat === "All" ? products : products.filter(p => p.category === cat);

  return (
    <section className="section">
      <h2 className="section-title">Our <span>Treats</span></h2>
      <p className="section-subtitle">Handmade with love, delivered to your door or ready for pickup</p>
      <div className="category-bar">
        {categories.map(c => (
          <button key={c} className={`cat-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="products-grid">
        {filtered.map((p, i) => <ProductCard key={p.id} product={p} onAdd={onAdd} delay={i * 80} />)}
      </div>
    </section>
  );
}

/* ─────────────────────────── CART SIDEBAR ─────────────────────────── */
function CartSidebar({ cart, updateQty, removeItem, close, goCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div className="cart-overlay" onClick={close} />
      <div className="cart-panel">
        <div className="cart-header">
          <h2>Your Cart 🛒</h2>
          <button className="cart-close" onClick={close}><XIcon /></button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🧁</div>
              <p>Your cart is empty!<br />Add some sweet treats to get started.</p>
            </div>
          ) : cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                <div className="cart-qty">
                  <button onClick={() => updateQty(item.id, -1)}><MinusIcon /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}><PlusIcon /></button>
                </div>
                <button className="cart-remove" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={goCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────── CHECKOUT PAGE ─────────────────────────── */
function CheckoutPage({ cart, onSuccess, goBack }) {
  const [delivery, setDelivery] = useState("pickup");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", notes: "", cardNum: "", cardExp: "", cardCvc: "" });
  const [processing, setProcessing] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = delivery === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePay = () => {
    if (!form.name || !form.email || !form.phone) return alert("Please fill in your contact details.");
    if (delivery === "delivery" && !form.address) return alert("Please enter a delivery address.");
    if (!form.cardNum || !form.cardExp || !form.cardCvc) return alert("Please enter your card details.");
    setProcessing(true);
    // Simulate Stripe payment
    setTimeout(() => {
      const order = {
        id: "SM-" + Date.now().toString(36).toUpperCase(),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        delivery,
        address: delivery === "delivery" ? `${form.address}, ${form.city}` : "Pickup",
        notes: form.notes,
        total,
        date: new Date().toISOString(),
        status: "new",
      };
      onSuccess(order);
    }, 2000);
  };

  return (
    <div className="checkout-page">
      <button className="nav-link" onClick={goBack} style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 4 }}>
        <BackIcon /> Back to cart
      </button>
      <h2>Checkout 💝</h2>

      {/* Delivery Toggle */}
      <div className="delivery-toggle">
        <div className={`delivery-opt ${delivery === "pickup" ? "selected" : ""}`} onClick={() => setDelivery("pickup")}>
          <span className="delivery-opt-icon">🏠</span>
          <div className="delivery-opt-label">Pickup</div>
          <div className="delivery-opt-sub">Free — collect from Dafne</div>
        </div>
        <div className={`delivery-opt ${delivery === "delivery" ? "selected" : ""}`} onClick={() => setDelivery("delivery")}>
          <span className="delivery-opt-icon">🚗</span>
          <div className="delivery-opt-label">Delivery</div>
          <div className="delivery-opt-sub">${DELIVERY_FEE.toFixed(2)} delivery fee</div>
        </div>
      </div>

      {/* Contact */}
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-input" placeholder="Your name" value={form.name} onChange={e => update("name", e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="hello@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" type="tel" placeholder="0400 000 000" value={form.phone} onChange={e => update("phone", e.target.value)} />
        </div>
      </div>

      {/* Delivery Address */}
      {delivery === "delivery" && (
        <>
          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input className="form-input" placeholder="123 Sweet Street" value={form.address} onChange={e => update("address", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">City / Suburb</label>
            <input className="form-input" placeholder="Your city" value={form.city} onChange={e => update("city", e.target.value)} />
          </div>
        </>
      )}

      <div className="form-group">
        <label className="form-label">Order Notes (optional)</label>
        <input className="form-input" placeholder="Allergies, special requests, preferred pickup time..." value={form.notes} onChange={e => update("notes", e.target.value)} />
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.map(i => (
          <div className="order-line" key={i.id}>
            <span>{i.name} × {i.qty}</span>
            <span>${(i.price * i.qty).toFixed(2)}</span>
          </div>
        ))}
        {delivery === "delivery" && (
          <div className="order-line"><span>Delivery Fee</span><span>${fee.toFixed(2)}</span></div>
        )}
        <div className="order-line total"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>

      {/* Card (Stripe placeholder) */}
      <label className="form-label">Payment Details</label>
      <div className="stripe-card">
        <input className="form-input" placeholder="Card number (e.g. 4242 4242 4242 4242)" value={form.cardNum} onChange={e => update("cardNum", e.target.value)} />
        <div className="stripe-row">
          <input className="form-input" placeholder="MM / YY" value={form.cardExp} onChange={e => update("cardExp", e.target.value)} />
          <input className="form-input" placeholder="CVC" value={form.cardCvc} onChange={e => update("cardCvc", e.target.value)} />
        </div>
      </div>

      <button className="pay-btn" onClick={handlePay} disabled={processing}>
        {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </div>
  );
}

/* ─────────────────────────── SUCCESS PAGE ─────────────────────────── */
function SuccessPage({ order, goHome }) {
  return (
    <div className="success-page">
      <div>
        <div className="success-icon">💖</div>
        <h2>Thank You!</h2>
        <div className="success-order-id">Order {order.id}</div>
        <p>
          Your order has been placed successfully!<br />
          {order.delivery === "pickup"
            ? "We'll let you know when your treats are ready for pickup."
            : `We'll deliver your treats to ${order.address}.`
          }
          <br />A confirmation has been sent to {order.customer.email}.
        </p>
        <button className="hero-btn" onClick={goHome}>Back to Home</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN: PRODUCT MODAL ─────────────────────────── */
function ProductModal({ product, onSave, onClose }) {
  const isNew = !product;
  const [f, setF] = useState(product || { name: "", category: "Cakes", price: 0, description: "", image: "", available: true });
  const [dragging, setDragging] = useState(false);
  const update = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  // Converts a chosen file into a base64 data URL string and stores it in state.
  // We use FileReader which is a built-in browser API for reading files.
  // readAsDataURL converts the file's binary data into a text string like
  // "data:image/png;base64,iVBOR..." which can be used directly as an <img> src.
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => update("image", e.target.result);
    reader.readAsDataURL(file);
  };

  // These drag event handlers create the visual "drop zone" effect.
  // We prevent the browser's default behaviour (which would open the file)
  // and instead handle it ourselves.
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{isNew ? "Add New Product" : "Edit Product"}</h3>
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input className="form-input" value={f.name} onChange={e => update("name", e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={f.category} onChange={e => update("category", e.target.value)}>
              {["Cakes", "Cupcakes", "Cookies", "Treats", "Custom"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input className="form-input" type="number" step="0.01" value={f.price} onChange={e => update("price", parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" value={f.description} onChange={e => update("description", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Product Image</label>
          {f.image ? (
            <div className="img-upload-preview">
              <img src={f.image} alt="Preview" />
              <button className="img-upload-remove" onClick={() => update("image", "")} title="Remove image">
                <XIcon />
              </button>
            </div>
          ) : (
            <div
              className={`img-upload-zone ${dragging ? "dragging" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { if (e.target.files.length) handleFile(e.target.files[0]); }}
              />
              <div className="img-upload-icon">📷</div>
              <div className="img-upload-text">
                <strong>Click to upload</strong> or drag & drop<br />
                PNG, JPG or WEBP
              </div>
            </div>
          )}
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={f.available} onChange={e => update("available", e.target.checked)} id="avail" />
          <label htmlFor="avail" className="form-label" style={{ margin: 0 }}>Available for sale</label>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="hero-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { if (!f.name) return; onSave(f); }}>
            {isNew ? "Add Product" : "Save Changes"}
          </button>
          <button className="nav-link" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN PAGE ─────────────────────────── */
function AdminPage({ products, setProducts, orders }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("products");
  const [editing, setEditing] = useState(null); // null = closed, "new" = new, or product object
  const [error, setError] = useState("");

  const tryLogin = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); setError(""); }
    else setError("Incorrect password. Try again.");
  };

  if (!authed) return (
    <div className="admin-login">
      <h2>Admin Portal 🔐</h2>
      <p>Enter your password to manage products and orders.</p>
      <div className="form-group">
        <input className="form-input" type="password" placeholder="Password" value={pass}
          onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()}
          style={{ textAlign: "center" }} />
      </div>
      {error && <p style={{ color: "#c53030", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button className="hero-btn" style={{ width: "100%", justifyContent: "center" }} onClick={tryLogin}>Login</button>
    </div>
  );

  const saveProduct = (data) => {
    setProducts(prev => {
      let next;
      if (editing === "new") {
        next = [...prev, { ...data, id: Date.now() }];
      } else {
        next = prev.map(p => p.id === editing.id ? { ...data, id: editing.id } : p);
      }
      saveToStorage(STORAGE_KEY, next);
      return next;
    });
    setEditing(null);
  };

  const deleteProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEY, next);
      return next;
    });
  };

  const toggleAvail = (id) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, available: !p.available } : p);
      saveToStorage(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard 🎀</h2>
        <button className="hero-btn" style={{ padding: "10px 24px", fontSize: 14 }} onClick={() => setEditing("new")}>
          + Add Product
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          Products ({products.length})
        </button>
        <button className={`admin-tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          Orders ({orders.length})
        </button>
      </div>

      {tab === "products" && (
        <div>
          {products.map(p => (
            <div className="admin-product-row" key={p.id}>
              <img src={p.image} alt={p.name} className="admin-product-img"
                onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23FFF0F3' width='64' height='64' rx='10'/%3E%3Ctext x='32' y='40' text-anchor='middle' font-size='24'%3E🧁%3C/text%3E%3C/svg%3E"; }}
              />
              <div className="admin-product-info">
                <div className="admin-product-name">{p.name}</div>
                <div className="admin-product-meta">
                  {p.category} · {p.available ? "✅ Available" : "❌ Unavailable"}
                </div>
              </div>
              <div className="admin-product-price">${p.price.toFixed(2)}</div>
              <div className="admin-actions">
                <button className="admin-btn admin-btn-toggle" onClick={() => toggleAvail(p.id)}>
                  {p.available ? "Hide" : "Show"}
                </button>
                <button className="admin-btn admin-btn-edit" onClick={() => setEditing(p)}>Edit</button>
                <button className="admin-btn admin-btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div>
          {orders.length === 0 && <p style={{ textAlign: "center", color: "var(--brown-lighter)", padding: 40 }}>No orders yet!</p>}
          {orders.slice().reverse().map(o => (
            <div className="order-card" key={o.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-id">{o.id}</span>
                  <span className="order-date" style={{ marginLeft: 12 }}>{new Date(o.date).toLocaleDateString()} {new Date(o.date).toLocaleTimeString()}</span>
                </div>
                <span className={`order-status ${o.status === "new" ? "status-new" : "status-done"}`}>
                  {o.status === "new" ? "NEW" : "DONE"}
                </span>
              </div>
              <div className="order-items-list">
                {o.items.map((item, i) => <span key={i}>{item.name} × {item.qty}{i < o.items.length - 1 ? ", " : ""}</span>)}
              </div>
              <div className="order-customer">
                👤 {o.customer.name} · 📧 {o.customer.email} · 📞 {o.customer.phone}
                <br />📦 {o.delivery === "pickup" ? "Pickup" : `Delivery to ${o.address}`}
                {o.notes && <><br />📝 {o.notes}</>}
              </div>
              <div style={{ textAlign: "right", fontWeight: 700, color: "var(--rose)", marginTop: 8, fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
                ${o.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ProductModal
          product={editing === "new" ? null : editing}
          onSave={saveProduct}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
function Footer({ onAdminClick }) {
  return (
    <footer className="footer">
      <p>Homemade Treats by Dafne · Est. 2026</p>
      <p>Made with 💖 and butter</p>
      <p style={{ marginTop: 12, fontSize: 11, opacity: 0.5 }}>© 2026 Sweet & Memo. All rights reserved.</p>
      <button onClick={onAdminClick} className="footer-admin-link">Site Management</button>
    </footer>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load persisted data
  useEffect(() => {
    (async () => {
      const savedProducts = await loadFromStorage(STORAGE_KEY, null);
      if (savedProducts && savedProducts.length) setProducts(savedProducts);
      const savedOrders = await loadFromStorage(ORDERS_KEY, []);
      setOrders(savedOrders);
      setLoaded(true);
    })();
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`${product.name} added to cart!`);
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = i.qty + delta;
      return newQty < 1 ? i : { ...i, qty: newQty };
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleOrderSuccess = async (order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    await saveToStorage(ORDERS_KEY, newOrders);
    setLastOrder(order);
    setCart([]);
    setPage("success");
  };

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <>
      <style>{CSS}</style>
      <Header page={page} setPage={setPage} cartCount={cartCount} openCart={() => setCartOpen(true)} />

      {page === "home" && (
        <>
          <Hero goShop={() => setPage("shop")} />
          <div className="scallop-divider" />
          <ShopPage products={products} onAdd={addToCart} />
        </>
      )}

      {page === "shop" && <ShopPage products={products} onAdd={addToCart} />}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          onSuccess={handleOrderSuccess}
          goBack={() => { setPage("shop"); setCartOpen(true); }}
        />
      )}

      {page === "success" && lastOrder && (
        <SuccessPage order={lastOrder} goHome={() => setPage("home")} />
      )}

      {page === "admin" && (
        <AdminPage products={products} setProducts={setProducts} orders={orders} />
      )}

      <Footer onAdminClick={() => setPage("admin")} />

      {cartOpen && (
        <CartSidebar
          cart={cart}
          updateQty={updateQty}
          removeItem={removeItem}
          close={() => setCartOpen(false)}
          goCheckout={() => { setCartOpen(false); setPage("checkout"); }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
