const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
const newsletter = document.querySelector('#newsletter');
if (newsletter) newsletter.addEventListener('submit', e => {
  e.preventDefault();
  const status = document.querySelector('#newsletter-status');
  if (status) status.textContent = 'Vui lòng liên hệ YesWood để đăng ký nhận tin.';
});
const carousel = document.querySelector('.product-grid');
if (carousel) {
  let dragStart = 0, scrollStart = 0, moved = false;
  carousel.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragStart = e.clientX; scrollStart = carousel.scrollLeft; moved = false;
    carousel.classList.add('dragging'); carousel.setPointerCapture(e.pointerId);
  });
  carousel.addEventListener('pointermove', e => {
    if (!carousel.classList.contains('dragging')) return;
    if (Math.abs(e.clientX - dragStart) > 4) moved = true;
    carousel.scrollLeft = scrollStart - (e.clientX - dragStart);
  });
  const stopDrag = () => carousel.classList.remove('dragging');
  carousel.addEventListener('pointerup', stopDrag);
  carousel.addEventListener('pointercancel', stopDrag);
  carousel.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
}
const megaShell=document.querySelector('#product-mega');
if(megaShell){
  const siteHeader=megaShell.closest('.site-header');
  const triggers=[...siteHeader.querySelectorAll('.mega-trigger')];
  const panels=[...megaShell.querySelectorAll('.mega-panel')];
  const closeMega=()=>{megaShell.classList.remove('is-open');panels.forEach(panel=>panel.classList.remove('is-active'));triggers.forEach(trigger=>trigger.setAttribute('aria-expanded','false'));};
  const openMega=slug=>{
    if(matchMedia('(max-width:700px)').matches)return;
    megaShell.classList.add('is-open');
    panels.forEach(panel=>panel.classList.toggle('is-active',panel.dataset.megaPanel===slug));
    triggers.forEach(trigger=>trigger.setAttribute('aria-expanded',String(trigger.dataset.mega===slug)));
  };
  triggers.forEach(trigger=>{
    trigger.addEventListener('pointerenter',()=>openMega(trigger.dataset.mega));
    trigger.addEventListener('focus',()=>openMega(trigger.dataset.mega));
  });
  siteHeader.querySelector('.utility')?.addEventListener('pointerenter',closeMega);
  siteHeader.querySelector('.inspire-menu')?.addEventListener('pointerenter',closeMega);
  siteHeader.querySelectorAll('.main-nav nav>a:not(.mega-trigger)').forEach(link=>{link.addEventListener('pointerenter',closeMega);link.addEventListener('focus',closeMega);});
  siteHeader.addEventListener('pointerleave',closeMega);
  siteHeader.addEventListener('focusout',event=>{if(!siteHeader.contains(event.relatedTarget))closeMega();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&megaShell.classList.contains('is-open')){closeMega();siteHeader.querySelector('.mega-trigger:focus')?.blur();}});
}
// Keep the product hearts and the header saved-products list in sync across pages.
(() => {
  const storageKey='yeswood-wishlist-v1';
  let memory=[];
  const read=()=>{
    try {
      const items=JSON.parse(localStorage.getItem(storageKey)||'[]');
      if(!Array.isArray(items))return [];
      // Older catalog tiles all shared the same detail ID. Keep that saved item as the first tile.
      return items.map(item=>item.id==='lumi'?{...item,id:'catalog:sofa:Tất cả sofa:product-1',url:'product-detail.html?item=lumi&wishlist='+encodeURIComponent('catalog:sofa:Tất cả sofa:product-1')}:item);
    } catch {return memory;}
  };
  const write=items=>{memory=items;try{localStorage.setItem(storageKey,JSON.stringify(items));}catch{ /* Browsers without storage keep this page usable. */ }};
  const detailId=url=>{
    try{const params=new URL(url,location.href).searchParams;return params.get('wishlist')||params.get('item')||'ignazio';}catch{return 'ignazio';}
  };
  const currentProduct=button=>{
    const card=button.closest('.product-card');
    if(card){
      const link=card.querySelector('.product-name');
      const photo=card.querySelector('.product-photo img');
      return {id:card.dataset.wishlistId||card.id||detailId(link?.getAttribute('href')||''),url:link?.getAttribute('href')||'product-detail.html',name:link?.textContent.trim()||photo?.alt||'Sản phẩm YESWOOD',image:photo?.getAttribute('src')||'',price:card.querySelector('.product-meta strong')?.textContent.trim()||''};
    }
    const info=document.querySelector('.product-info');
    if(info){
      const price=info.querySelector('.purchase>strong');
      return {id:detailId(location.href),url:'product-detail.html'+location.search,name:info.querySelector('h1')?.textContent.trim()||'Sản phẩm YESWOOD',image:document.querySelector('#main-product-photo')?.getAttribute('src')||'',price:price&&!price.hidden?price.textContent.trim():''};
    }
    return null;
  };
  const sync=()=>{
    const items=read();
    const count=document.querySelector('#wishlist-count');
    if(count){count.textContent=String(items.length);count.hidden=items.length===0;}
    document.querySelectorAll('.favorite').forEach(button=>{
      const product=currentProduct(button);
      if(product)button.setAttribute('aria-pressed',String(items.some(item=>item.id===product.id)));
    });
    const grid=document.querySelector('#wishlist-grid');
    if(!grid)return;
    grid.replaceChildren();
    const empty=document.querySelector('#wishlist-empty');
    empty.hidden=items.length>0;
    document.querySelector('#wishlist-summary').textContent=items.length?`${items.length} sản phẩm đã lưu`:'';
    items.forEach(item=>{
      const article=document.createElement('article');article.className='wishlist-card';
      const photo=document.createElement('div');photo.className='wishlist-card-image';
      const photoLink=document.createElement('a');photoLink.href=item.url;
      if(item.image){const img=document.createElement('img');img.src=item.image;img.alt=item.name;img.loading='lazy';photoLink.append(img);}
      const remove=document.createElement('button');remove.type='button';remove.className='wishlist-remove';remove.setAttribute('aria-label',`Bỏ lưu ${item.name}`);
      remove.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.6 12.8C-1 8 5.7.5 12 6c6.3-5.5 13 2 8.4 6.8Z"/></svg>';
      remove.addEventListener('click',()=>{write(read().filter(saved=>saved.id!==item.id));sync();});
      photo.append(photoLink,remove);
      const title=document.createElement('a');title.className='wishlist-card-name';title.href=item.url;title.textContent=item.name;
      article.append(photo,title);
      if(item.price){const price=document.createElement('p');price.className='wishlist-card-price';price.textContent=item.price;article.append(price);}
      grid.append(article);
    });
  };
  document.querySelectorAll('.favorite').forEach(button=>button.addEventListener('click',()=>{
    const product=currentProduct(button);if(!product)return;
    const items=read();const index=items.findIndex(item=>item.id===product.id);
    if(index>=0)items.splice(index,1);else items.push(product);
    write(items);sync();
  }));
  window.addEventListener('storage',event=>{if(event.key===storageKey)sync();});
  window.addEventListener('pageshow',sync);
  window.yeswoodWishlistSync=sync;
  sync();
})();
