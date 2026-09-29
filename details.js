document.querySelectorAll('.gallery-thumb').forEach(button=>button.addEventListener('click',()=>{
  const main=document.querySelector('#main-product-photo');main.src=button.dataset.img;
  document.querySelectorAll('.gallery-thumb').forEach(x=>{x.classList.toggle('selected',x===button);x.setAttribute('aria-pressed',String(x===button));});
}));
document.querySelectorAll('.size-options button,.detail-colors button').forEach(button=>button.addEventListener('click',()=>{
  const group=button.parentElement;group.querySelectorAll('button').forEach(x=>{x.classList.toggle('selected',x===button);if(group.classList.contains('detail-colors'))x.setAttribute('aria-pressed',String(x===button));});
}));
document.querySelectorAll('.hotspot-dot').forEach(button=>button.addEventListener('click',()=>{
 const spot=button.closest('.hotspot');document.querySelectorAll('.hotspot').forEach(x=>{if(x!==spot){x.classList.remove('active');x.querySelector('.hotspot-dot').setAttribute('aria-expanded','false')}});
 const active=spot.classList.toggle('active');button.setAttribute('aria-expanded',String(active));
}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.hotspot.active').forEach(x=>{x.classList.remove('active');x.querySelector('.hotspot-dot').setAttribute('aria-expanded','false')})});
const item=new URLSearchParams(location.search).get('item');
const variants={
 'lumi':['Lumi Corduroy Fabric Sofa Bed','05-01-sofa.png'],
 'volterra':['Volterra coffee table','coffee-table-15.webp'],
 'nila-bed':['Nila lounge high','09-giuong.png'],
 'nila-chair':['Nila lounge high','07-03-ghe-thu-gian.png'],
 'nila-bench':['Nila lounge high','08-10-ghe-thay-giay.png'],
 'nila-screen':['Nila lounge high','09-11-binh-phong.png']
};
if(item&&variants[item]){
 const [name,img]=variants[item];document.title=`${name} | YESWOOD`;
 document.querySelector('.product-info h1').textContent=name;
 document.querySelector('.detail-breadcrumb strong').textContent=name;
 // Lumi uses the supplied coffee-table gallery. Other demo items have one image.
 if(item!=='lumi'){
  const main=document.querySelector('#main-product-photo');main.src=`assets/${img}`;main.alt=name;
  document.querySelector('.thumbs').hidden=true;
  document.querySelector('.gallery').classList.add('single-image');
 }
 // The other products have no supplied specifications or confirmed price yet.
 if(item!=='lumi'){
  document.querySelector('.product-info>small').hidden=true;
  document.querySelector('.product-info .intro').hidden=true;
  document.querySelector('.detail-accordion').hidden=true;
  document.querySelector('.purchase>strong').hidden=true;
  document.querySelector('.purchase .stock').hidden=true;
 }
}
