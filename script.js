const WHATSAPP_NUMBER = '919928933267'; // Main business contact number, in international format without +
const cart = [];
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function openCart() {
  cartDrawer.classList.add('open'); cartBackdrop.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open'); cartBackdrop.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
}
function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Your enquiry cart is empty.<br><small>Explore the collections to add products.</small></div>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div><h4>${escapeHTML(item.name)}</h4><p>${escapeHTML(item.options)}</p></div>
      <div class="cart-item-controls"><button data-action="minus" data-index="${index}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-action="plus" data-index="${index}" aria-label="Increase quantity">+</button><button class="remove-item" data-action="remove" data-index="${index}" aria-label="Remove item">Remove</button></div>
    </div>`).join('');
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.product;
  const options = button.dataset.options || '';
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += 1; else cart.push({ name, options, qty: 1 });
  renderCart(); showToast(`${name} added to your enquiry cart.`);
}));
document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]'); if (!button) return;
  const item = cart[Number(button.dataset.index)]; if (!item) return;
  if (button.dataset.action === 'plus') item.qty++;
  if (button.dataset.action === 'minus') item.qty--;
  if (button.dataset.action === 'remove' || item.qty <= 0) cart.splice(Number(button.dataset.index), 1);
  renderCart();
});
function sendWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
document.getElementById('checkoutButton').addEventListener('click', () => {
  if (!cart.length) { showToast('Add at least one product to your enquiry first.'); return; }
  const lines = cart.map(item => `• ${item.name} — enquiry quantity: ${item.qty}\n  ${item.options}`).join('\n');
  const notes = document.getElementById('cartNotes').value.trim();
  const message = `Hello Mundhra Udyog / Natraj Brand,\n\nI would like to enquire about these products:\n${lines}${notes ? `\n\nAdditional requirements: ${notes}` : ''}\n\nPlease share current pricing, availability and order details.\n\nName:`;
  sendWhatsApp(message);
});
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  const message = `Hello Mundhra Udyog / Natraj Brand,\n\nName: ${data.get('name')}\nEnquiry type: ${data.get('interest')}\nMessage: ${data.get('message')}\n\nPlease get back to me with details. `;
  sendWhatsApp(message);
});
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => card.classList.toggle('hidden-card', filter !== 'all' && card.dataset.category !== filter));
}));
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
document.getElementById('year').textContent = new Date().getFullYear();
