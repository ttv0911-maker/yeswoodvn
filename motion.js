/* YESWOOD motion layer: scroll reveal + soft page transitions. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  const main = document.querySelector('main');
  const SKIP = '.hero,.about-hero,.page-heading,nav,.detail-breadcrumb,[hidden],dialog,.filter-layer,script,style';

  const isGroup = el => {
    const cs = getComputedStyle(el), d = cs.display;
    if (/auto|scroll/.test(cs.overflowX)) return false; // horizontal sliders reveal as one block
    return (d.includes('grid') || d.includes('flex')) && el.children.length >= 3;
  };
  const usable = el => {
    if (el.matches(SKIP)) return false;
    const cs = getComputedStyle(el);
    return cs.position !== 'absolute' && cs.position !== 'fixed' && cs.display !== 'none';
  };
  const targets = [];
  const tag = (el, i = 0) => {
    if (!usable(el)) return;
    el.classList.add('mo-reveal');
    if (getComputedStyle(el).transform !== 'none') el.classList.add('mo-fade');
    if (i) el.style.setProperty('--mo-delay', Math.min(i, 6) * 0.09 + 's');
    targets.push(el);
  };
  const tagBlock = el => {
    if (!usable(el)) return;
    if (isGroup(el)) [...el.children].forEach((c, i) => tag(c, i));
    else tag(el);
  };

  // Sections inside <main>: reveal each direct child (grids reveal item by item).
  const sections = main ? [...main.querySelectorAll('section')] : [];
  if (main && !sections.length) [...main.children].forEach(c => [...c.children].forEach(tagBlock));
  sections.forEach(sec => {
    if (sec.matches(SKIP) || sec.closest(SKIP)) return;
    [...sec.children].forEach(ch => { if (ch.tagName !== 'SECTION') tagBlock(ch); });
  });
  // Footer columns
  document.querySelectorAll('.footer-grid').forEach(g => [...g.children].forEach((c, i) => tag(c, i)));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      el.classList.add('mo-in');
      // Hand control back to the site's own styles once the reveal is done.
      setTimeout(() => {
        el.classList.remove('mo-reveal', 'mo-in', 'mo-fade');
        el.style.removeProperty('--mo-delay');
      }, 1600);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(el => io.observe(el));

  // Soft fade-out when going to another page of the site.
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || !/\.html?$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    document.documentElement.classList.add('mo-leaving');
    setTimeout(() => { location.href = a.href; }, 230);
  });
  window.addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('mo-leaving'); });
})();
