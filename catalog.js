const catalog = document.querySelector('.catalog-page');
if (catalog) {
  // One catalog layout serves each menu category until distinct product data is supplied.
  const params = new URLSearchParams(location.search);
  const groupNames = {sofa:'Sofa',ban:'Bàn',ghe:'Ghế & đôn',tu:'Tủ',ke:'Kệ & đảo bếp',giuong:'Giường & nệm'};
  const groupKey = params.get('group') || 'sofa';
  const groupName = groupNames[groupKey] || 'Sofa';
  const selectedName = params.get('category') || 'Tất cả sofa';
  document.title = `${selectedName} | YESWOOD`;
  const crumbs = document.querySelector('.breadcrumb');
  if (crumbs) {
    const groupLink = crumbs.querySelectorAll('a')[1];
    groupLink.textContent = groupName;
    groupLink.href = groupKey === 'sofa' ? 'sofa.html' : `sofa.html?category=${encodeURIComponent(groupName)}&group=${groupKey}`;
    crumbs.querySelector('span:last-child').textContent = selectedName;
  }
  document.querySelector('#catalog-grid')?.setAttribute('aria-label', `Danh sách ${selectedName.toLowerCase()}`);
  const layer = document.querySelector('#filter-layer');
  const drawer = layer.querySelector('.filter-drawer');
  const grid = document.querySelector('#catalog-grid');
  const original = [...grid.querySelectorAll('.product-card')];
  original.forEach(card => {
    const id = ['catalog',groupKey,selectedName,card.id].join(':');
    card.dataset.wishlistId = id;
    const detailLink = card.querySelector('.product-name');
    const detailUrl = new URL(detailLink.href);
    detailUrl.searchParams.set('wishlist',id);
    detailLink.href = detailUrl.pathname.split('/').pop() + detailUrl.search;
    card.querySelector('.product-photo').addEventListener('click', event => {
      if (event.target.closest('button')) return;
      location.href = detailLink.href;
    });
  });
  window.yeswoodWishlistSync?.();
  const count = document.querySelector('#product-count');
  const empty = document.querySelector('#empty-results');
  const pageButtons = [...document.querySelectorAll('.page-number')];
  const prev = document.querySelector('#prev-page');
  const next = document.querySelector('#next-page');
  const sortToggle = document.querySelector('#sort-toggle');
  const sortMenu = document.querySelector('#sort-menu');
  const min = document.querySelector('#price-min');
  const max = document.querySelector('#price-max');
  const quickFilters = [...document.querySelectorAll('.filter-shortcut')];
  const quickMin = document.querySelector('#quick-price-min');
  const quickMax = document.querySelector('#quick-price-max');
  let page = 1;
  let sort = 'default';
  let filtered = original;
  let opener;
  const format = value => new Intl.NumberFormat('en-US').format(value) + ' VND';

  const updateRange = () => {
    if (+min.value > +max.value) { if (document.activeElement === min) max.value = min.value; else min.value = max.value; }
    document.querySelector('#min-value').value = format(+min.value);
    document.querySelector('#max-value').value = format(+max.value);
    quickMin.value = min.value;
    quickMax.value = max.value;
    document.querySelector('#quick-min-value').value = format(+min.value);
    document.querySelector('#quick-max-value').value = format(+max.value);
  };
  const syncQuickOptions = () => {
    document.querySelectorAll('.filter-popover input[type="checkbox"]').forEach(input => {
      const drawerInput = layer.querySelector(`#${input.dataset.section} input[value="${input.value}"]`);
      input.checked = drawerInput.checked;
    });
    updateRange();
  };
  const closeQuick = () => quickFilters.forEach(button => {
    button.setAttribute('aria-expanded','false');
    document.querySelector('#'+button.getAttribute('aria-controls')).hidden = true;
  });
  const checked = section => [...layer.querySelectorAll(`#${section} input:checked`)].map(input => input.value);
  const applyFilters = () => {
    const colors = checked('color'), materials = checked('material'), collections = checked('collection'), statuses = checked('status');
    const activeTags = [...layer.querySelectorAll('[data-filter-tag][aria-pressed="true"]')].map(b => b.dataset.filterTag);
    filtered = original.filter(card =>
      +card.dataset.price >= +min.value && +card.dataset.price <= +max.value &&
      (!colors.length || colors.includes(card.dataset.color)) &&
      (!materials.length || materials.includes(card.dataset.material)) &&
      (!collections.length || collections.includes(card.dataset.collection)) &&
      (!statuses.length || statuses.includes(card.dataset.status)) &&
      (!activeTags.length || activeTags.includes(card.dataset.tag))
    );
    if (sort !== 'default') {
      const rank = c => c.dataset.tag === sort ? 0 : 1;
      filtered = [...filtered].sort((a,b) => sort === 'price-asc' ? +a.dataset.price - +b.dataset.price : sort === 'price-desc' ? +b.dataset.price - +a.dataset.price : rank(a)-rank(b));
    }
    page = 1; render();
  };
  const render = () => {
    filtered.forEach(card => grid.append(card));
    original.forEach(card => card.hidden = true);
    filtered.slice((page-1)*9,page*9).forEach(card => card.hidden = false);
    count.textContent = `${filtered.length} sản phẩm`;
    empty.hidden = filtered.length !== 0;
    const pages = Math.ceil(filtered.length/9);
    pageButtons.forEach(button => {
      const active = +button.dataset.page === page;
      button.hidden = +button.dataset.page > pages;
      button.classList.toggle('current',active);
      if (active) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
    });
    prev.disabled = page <= 1;
    next.disabled = page >= pages;
  };
  const closeDrawer = () => { layer.hidden = true; document.body.classList.remove('filter-open'); opener?.focus(); };
  document.querySelector('[data-open-filter="top"]').addEventListener('click', event => {
    closeQuick();
    opener = event.currentTarget; layer.hidden = false; document.body.classList.add('filter-open');
    layer.querySelector('.filter-close').focus();
  });
  quickFilters.forEach(button => button.addEventListener('click', () => {
    const panel = document.querySelector('#'+button.getAttribute('aria-controls'));
    const wasOpen = !panel.hidden;
    closeQuick();
    if (!wasOpen) {
      syncQuickOptions();
      panel.hidden = false;
      button.setAttribute('aria-expanded','true');
      // Keep the panel within the viewport while anchoring it to its button.
      panel.style.transform = '';
      const overflow = panel.getBoundingClientRect().right - (innerWidth - 16);
      if (overflow > 0) panel.style.transform = `translateX(-${overflow}px)`;
    }
  }));
  document.querySelectorAll('.filter-popover input[type="checkbox"]').forEach(input => input.addEventListener('change',() => {
    layer.querySelector(`#${input.dataset.section} input[value="${input.value}"]`).checked = input.checked;
    applyFilters();
  }));
  [quickMin,quickMax].forEach(input => input.addEventListener('input',() => {
    if (+quickMin.value > +quickMax.value) {
      if (input === quickMin) quickMax.value = quickMin.value;
      else quickMin.value = quickMax.value;
    }
    min.value = quickMin.value; max.value = quickMax.value;
    updateRange(); applyFilters();
  }));
  layer.querySelector('.filter-backdrop').addEventListener('click',closeDrawer);
  layer.querySelector('.filter-close').addEventListener('click',closeDrawer);
  layer.querySelector('#apply-filters').addEventListener('click',() => {applyFilters();syncQuickOptions();closeDrawer();});
  layer.querySelector('#clear-filters').addEventListener('click',() => {
    layer.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    layer.querySelectorAll('[data-filter-tag]').forEach(button => button.setAttribute('aria-pressed','false'));
    min.value = min.min; max.value = max.max; syncQuickOptions(); applyFilters();
  });
  layer.querySelectorAll('[data-filter-tag]').forEach(button => button.addEventListener('click',() => button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed') !== 'true'))));
  min.addEventListener('input',updateRange);max.addEventListener('input',updateRange);updateRange();
  sortToggle.addEventListener('click',() => {
    sortMenu.hidden = !sortMenu.hidden;
    sortToggle.setAttribute('aria-expanded',String(!sortMenu.hidden));
  });
  sortMenu.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click',() => {
    sort = button.dataset.sort;
    sortMenu.querySelectorAll('[data-sort]').forEach(option => option.setAttribute('aria-current',String(option === button)));
    sortMenu.hidden = true;sortToggle.setAttribute('aria-expanded','false');sortToggle.focus();
    applyFilters();
  }));
  document.addEventListener('click',e => {
    if (!e.target.closest('.sort-shell')) {sortMenu.hidden=true;sortToggle.setAttribute('aria-expanded','false');}
    if (!e.target.closest('.filter-control')) closeQuick();
  });
  document.addEventListener('keydown',e => {
    if (e.key !== 'Escape') return;
    if (!layer.hidden) {closeDrawer();return;}
    closeQuick();
    sortMenu.hidden=true;sortToggle.setAttribute('aria-expanded','false');
  });
  pageButtons.forEach(button => button.addEventListener('click',() => {page=+button.dataset.page;render();catalog.scrollIntoView({behavior:'smooth'});}));
  prev.addEventListener('click',() => {if(page>1){page--;render();catalog.scrollIntoView({behavior:'smooth'});}});
  next.addEventListener('click',() => {if(page<Math.ceil(filtered.length/9)){page++;render();catalog.scrollIntoView({behavior:'smooth'});}});
  grid.querySelectorAll('.swatches button').forEach(button => button.addEventListener('click',() => {
    const group=button.parentElement;
    group.querySelectorAll('button').forEach(b => {b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  }));
  document.querySelectorAll('.hotspot').forEach(spot => {
    const trigger=spot.querySelector('.hotspot-dot');
    trigger.addEventListener('click',() => {
      const active=spot.classList.contains('active');
      document.querySelectorAll('.hotspot.active').forEach(s => {s.classList.remove('active');s.querySelector('.hotspot-dot').setAttribute('aria-expanded','false');});
      spot.classList.toggle('active',!active);trigger.setAttribute('aria-expanded',String(!active));
    });
    spot.querySelector('.hotspot-card').addEventListener('click',() => {spot.classList.remove('active');trigger.setAttribute('aria-expanded','false');});
  });
  render();
}
