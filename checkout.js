// ===== CHECKOUT PAGE =====
// ⚠️  STRIPE SETUP INSTRUCTIONS:
// 1. Create a Stripe account at https://stripe.com
// 2. Add your bank account in Stripe → Settings → Payouts (supports international)
// 3. Get your Publishable Key from Stripe → Developers → API Keys
// 4. Replace 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' below with your real key
// 5. Set up a backend endpoint (Node.js/PHP/Python) to create PaymentIntents
//    Example backend: https://stripe.com/docs/payments/accept-a-payment

const STRIPE_PK = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE'; // 🔑 Replace with your key

(function() {
  // Get book from URL params
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get('id'));
  const book   = (typeof BOOKS !== 'undefined') ? BOOKS.find(b => b.id === bookId) : null;

  // Populate order summary
  const orderBook = document.getElementById('orderBook');
  if (book && orderBook) {
    orderBook.innerHTML = `
      <div class="order-book-icon" style="background: linear-gradient(135deg, ${book.color}, ${book.color}aa);">
        ${book.emoji}
      </div>
      <div>
        <div class="order-book-cat">${book.category}</div>
        <div class="order-book-title">${book.title}</div>
        <div class="order-book-meta">${book.pages} pages · PDF · ${book.format}</div>
      </div>
    `;
    const price = `$${book.price}.00`;
    document.getElementById('subtotal').textContent   = price;
    document.getElementById('totalAmount').textContent = price;
    document.getElementById('payBtnAmount').textContent = price;
  } else if (orderBook) {
    orderBook.innerHTML = '<p style="color:rgba(255,255,255,0.6)">No book selected. <a href="catalog.html" style="color:var(--gold)">Browse catalog</a></p>';
  }

  // Card number formatting
  const cardNum = document.getElementById('cardNumber');
  if (cardNum) {
    cardNum.addEventListener('input', function() {
      let val = this.value.replace(/\D/g,'').substring(0,16);
      this.value = val.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  // Expiry formatting
  const cardExp = document.getElementById('cardExpiry');
  if (cardExp) {
    cardExp.addEventListener('input', function() {
      let val = this.value.replace(/\D/g,'').substring(0,4);
      if (val.length >= 2) val = val.substring(0,2) + ' / ' + val.substring(2);
      this.value = val;
    });
  }
})();

// ===== HANDLE CHECKOUT =====
function handleCheckout() {
  const alertEl = document.getElementById('paymentAlert');
  const btn     = document.getElementById('payBtn');

  // Basic validation
  const fields = ['firstName','lastName','emailAddr','cardNumber','cardExpiry','cardCvc','cardName'];
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) { el.style.borderColor = 'red'; valid = false; }
    else if (el) el.style.borderColor = '';
  });
  if (!document.getElementById('agreeTerms').checked) {
    alertEl.innerHTML = '<div class="alert alert-error">Please agree to the Terms of Service to continue.</div>';
    return;
  }
  if (!valid) {
    alertEl.innerHTML = '<div class="alert alert-error">Please fill in all required fields.</div>';
    return;
  }

  // ===== STRIPE INTEGRATION (uncomment when backend is ready) =====
  /*
  const stripe = Stripe(STRIPE_PK);

  // Call YOUR backend to create a PaymentIntent
  fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookId: new URLSearchParams(location.search).get('id'),
      email: document.getElementById('emailAddr').value
    })
  })
  .then(r => r.json())
  .then(data => {
    return stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardElement, // Stripe Elements card element
        billing_details: {
          name: document.getElementById('cardName').value,
          email: document.getElementById('emailAddr').value
        }
      }
    });
  })
  .then(result => {
    if (result.error) {
      alertEl.innerHTML = `<div class="alert alert-error">${result.error.message}</div>`;
    } else {
      window.location.href = 'success.html?id=' + bookId;
    }
  });
  */

  // ===== DEMO MODE (remove when Stripe is live) =====
  btn.textContent = '⏳ Processing…';
  btn.disabled = true;
  alertEl.innerHTML = '<div class="alert alert-info">🔄 Processing your payment securely via Stripe…</div>';

  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    window.location.href = 'success.html?id=' + (params.get('id') || 1);
  }, 2500);
}
