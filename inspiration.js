document.querySelectorAll('[data-show-more]').forEach(button=>button.addEventListener('click',()=>{
 const section=button.closest('.inspire-cards');
 if(section.closest('.guide-page')){
  section.querySelectorAll('.more-card').forEach(card=>card.style.display='block');
 }else{
  const grid=section.querySelector('.inspire-card-grid');
  [...grid.querySelectorAll('.inspire-card')].slice(0,3).forEach(card=>grid.append(card.cloneNode(true)));
 }
 button.remove();
}));
