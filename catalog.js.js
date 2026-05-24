// ===== CATALOG PAGE =====
(function() {
  const grid        = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('searchInput');
  const catFilter   = document.getElementById('catFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter  = document.getElementById('sortFilter');
  const countEl     = document.getElementById('resultCount');
  const noResults   = document.getElementById('noResults');

  // Read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) catFilter.value = params.get('cat');

  function renderCard(book) {
    return `
      <div class="book-card">
        <div class="book-card-cover" style="background: linear-gradient(135deg, ${book.color}, ${book.color}bb);">
          <span style="font-size:2.5rem;">${book.emoji}</span>
        </div>
        <div class="book-card-body">
          <div class="book-card-category">${book.category}</div>
          <h3 class="book-card-title">${book.title}</h3>
          <p class="book-card-desc">${book.desc}</p>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
            By ${book.author} · ${book.pages} pages · Updated ${book.updated}
          </div>
          <div class="book-card-footer">
            <div class="book-price">$${book.price}<span>/PDF</span></div>
            <a href="checkout.html?id=${book.id}" class="btn-buy">Buy Now</a>
          </div>
        </div>
      </div>
    `;
  }

  function filter() {
    const q     = searchInput.value.toLowerCase().trim();
    const cat   = catFilter.value;
    const price = priceFilter.value ? parseInt(priceFilter.value) : null;
    const sort  = sortFilter.value;

    let results = BOOKS.filter(b => {
      const matchQ     = !q || b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchCat   = !cat   || b.cat === cat;
      const matchPrice = !price || b.price === price;
      return matchQ && matchCat && matchPrice;
    });

    // Sort
    if (sort === 'price-asc')  results.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') results.sort((a,b) => b.price - a.price);
    if (sort === 'alpha')      results.sort((a,b) => a.title.localeCompare(b.title));

    grid.innerHTML = results.map(renderCard).join('');
    countEl.textContent = `${results.length} title${results.length !== 1 ? 's' : ''} found`;
    noResults.style.display = results.length === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input',  filter);
  catFilter  .addEventListener('change', filter);
  priceFilter.addEventListener('change', filter);
  sortFilter .addEventListener('change', filter);

  filter(); // initial render
})();
