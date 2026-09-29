const woods = document.querySelector('.m-wood-scroll');
if (woods) {
 let startX = 0, startScroll = 0, dragging = false;
 woods.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  startX = e.clientX; startScroll = woods.scrollLeft; dragging = true;
  woods.classList.add('dragging'); woods.setPointerCapture(e.pointerId);
 });
 woods.addEventListener('pointermove', e => { if (dragging) woods.scrollLeft = startScroll - (e.clientX - startX); });
 const stop = () => { dragging = false; woods.classList.remove('dragging'); };
 woods.addEventListener('pointerup', stop); woods.addEventListener('pointercancel', stop);
 woods.addEventListener('keydown', e => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
  e.preventDefault();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (e.key === 'Home' || e.key === 'End') woods.scrollTo({left:e.key === 'Home' ? 0 : woods.scrollWidth,behavior:reduced?'auto':'smooth'});
  else woods.scrollBy({left:(e.key==='ArrowRight'?1:-1)*342,behavior:reduced?'auto':'smooth'});
 });
}
