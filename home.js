// ===== HOME PAGE =====
(function() {
  function renderBookCard(book) {
    return `
      <div class="book-card" data-id="${book.id}">
        <div class="book-card-cover" style="background: linear-gradient(135deg, ${book.color}, ${book.color}cc);">
          <span style="font-size:2.5rem;">${book.emoji}</span>
        </div>
        <div class="book-card-body">
          <div class="book-card-category">${book.category}</div>
          <h3 class="book-card-title">${book.title}</h3>
          <p class="book-card-desc">${book.desc}</p>
          <div class="book-card-footer">
            <div class="book-price">$${book.price}<span>/PDF</span></div>
            <a href="pages/checkout.html?id=${book.id}" class="btn-buy">Buy Now</a>
          </div>
        </div>
      </div>
    `;
  }

  // Render featured books
  const container = document.getElementById('featuredBooks');
  if (container && typeof BOOKS !== 'undefined') {
    const featured = BOOKS.filter(b => b.featured);
    container.innerHTML = featured.map(renderBookCard).join('');
  }

  // Scroll reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cat-card, .book-card, .step, .testimonial').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();
