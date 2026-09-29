const rooms={living:['Phòng khách','14-01_living_room_1415x696.webp'],office:['Phòng làm việc','10-02_home_office_731x993.webp'],dining:['Phòng bếp','12-04_dining_room_640x480.webp'],bedroom:['Phòng ngủ','11-03_bedroom_640x480.webp'],kids:['Phòng trẻ em','13-05_kids_room_1415x696.webp']};
const key=new URLSearchParams(location.search).get('room')||'living';
const room=rooms[key]||rooms.living;
document.title=`${room[0]} | YESWOOD`;
document.querySelector('#room-crumb').textContent=room[0];
// Reuse the approved room-detail layout for all five rooms; only headings change.
document.querySelector('.living-detail').hidden=false;
document.querySelector('.other-room-detail').hidden=true;
document.querySelector('.living-detail .room-intro h1').textContent=room[0];
document.querySelector('.living-detail .room-item-track').setAttribute('aria-label',`Danh mục nội thất ${room[0].toLowerCase()}`);
document.querySelector('.living-detail .room-inspirations h2').textContent=`Cảm hứng ${room[0].toLowerCase()}`;
document.querySelectorAll('.scene-dot').forEach(button=>button.addEventListener('click',()=>{
 const spot=button.closest('.scene-spot');document.querySelectorAll('.scene-spot').forEach(x=>{if(x!==spot){x.classList.remove('active');x.querySelector('.scene-dot').setAttribute('aria-expanded','false')}});
 const active=spot.classList.toggle('active');button.setAttribute('aria-expanded',String(active));
}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.scene-spot.active').forEach(spot=>{spot.classList.remove('active');spot.querySelector('.scene-dot').setAttribute('aria-expanded','false')})});
