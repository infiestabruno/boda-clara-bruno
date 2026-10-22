const asiste=document.getElementById('asiste');
const plus=document.getElementById('plus');
const bus=document.getElementById('bus');
const form=document.getElementById('rsvpForm');
const estado=document.getElementById('estado');
// Replace this URL with your deployed Apps Script /exec URL to activate RSVP.
const APPS_SCRIPT_URL = 'PEGAR_URL_DE_APPS_SCRIPT_AQUI';
function refresh(){
 const attending=asiste.value==='si';
 const companion=attending&&plus.value==='si';
 document.getElementById('extra').classList.toggle('hidden',!attending);
 document.getElementById('nombrePlus').classList.toggle('hidden',!companion);
 document.getElementById('alergiasAcompanante').classList.toggle('hidden',!companion);
 document.getElementById('busInfo').classList.toggle('hidden',!attending||bus.value==='no');
 document.getElementById('acompanante').required=companion;
 document.getElementById('plazas').disabled=!attending||bus.value==='no';
 document.getElementById('trayecto').disabled=!attending||bus.value==='no';
}
[asiste,plus,bus].forEach(el=>el.addEventListener('change',refresh));refresh();
form.addEventListener('submit',e=>{
 if(!APPS_SCRIPT_URL.startsWith('https://script.google.com/macros/s/')){
  e.preventDefault();estado.textContent='Todavía falta configurar Google Apps Script. No se ha guardado ninguna respuesta.';return;
 }
 if(!form.reportValidity()){e.preventDefault();return;}
 const seats=(asiste.value==='si'&&bus.value==='si')?Number(document.getElementById('plazas').value):0;
 const trip=document.getElementById('trayecto').value;
 document.getElementById('plazasIda').value=seats&&(trip==='ida'||trip==='ida-vuelta')?seats:0;
 document.getElementById('plazasVuelta').value=seats&&(trip==='vuelta'||trip==='ida-vuelta')?seats:0;
 document.getElementById('nonce').value=crypto.randomUUID?crypto.randomUUID():String(Date.now());
 form.action=APPS_SCRIPT_URL;
 estado.textContent='Se abrirá una página de Google con el resultado del envío. Comprueba el mensaje de confirmación.';
});
const copy=document.querySelector('.copy');
if(copy)copy.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText('ES5515830001189104760915');copy.textContent='¡IBAN copiado!'}
 catch(e){copy.textContent='Selecciona el IBAN para copiarlo'}
});


// Carrusel editorial, accesible mediante flechas, teclado y gestos.
(function(){
 const track=document.getElementById('historyCarousel');
 if(!track)return;
 const cards=Array.from(track.querySelectorAll('figure'));
 const count=document.getElementById('carouselCount');
 const progress=document.getElementById('carouselProgress');
 const prev=document.querySelector('.carousel-prev');
 const next=document.querySelector('.carousel-next');
 let active=0;
 const centerOf=(el)=>el.offsetLeft+el.offsetWidth/2;
 function closest(){
  const mid=track.scrollLeft+track.clientWidth/2;
  let index=0, min=Infinity;
  cards.forEach((card,i)=>{const d=Math.abs(centerOf(card)-mid);if(d<min){min=d;index=i;}});
  return index;
 }
 function render(){
  active=closest();
  cards.forEach((card,i)=>card.classList.toggle('is-active',i===active));
  if(count)count.textContent=(active+1)+' / '+cards.length;
  if(progress)progress.style.width=((active+1)/cards.length*100)+'%';
  if(prev)prev.disabled=active===0;
  if(next)next.disabled=active===cards.length-1;
 }
 function go(i){
  const target=cards[Math.max(0,Math.min(cards.length-1,i))];
  if(!target)return;
  track.scrollTo({left:centerOf(target)-track.clientWidth/2,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 prev?.addEventListener('click',()=>go(active-1));
 next?.addEventListener('click',()=>go(active+1));
 track.addEventListener('scroll',()=>requestAnimationFrame(render),{passive:true});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(active-1);}else if(e.key==='ArrowRight'){e.preventDefault();go(active+1);}});
 window.addEventListener('resize',render);
 cards.forEach((c,i)=>c.addEventListener('click',()=>go(i)));
 requestAnimationFrame(()=>{go(0);render();});
})();