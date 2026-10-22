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


// Carrusel de fotos: botones y deslizamiento táctil nativo.
(function(){
 const track=document.getElementById('historyCarousel');
 if(!track)return;
 const cards=[...track.querySelectorAll('figure')];
 const counter=document.getElementById('carouselCount');
 function current(){const middle=track.scrollLeft+track.clientWidth/2;let best=0,dist=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft-track.offsetLeft+c.offsetWidth/2-middle);if(d<dist){dist=d;best=i}});return best}
 function goto(i){const card=cards[Math.max(0,Math.min(cards.length-1,i))];if(card)track.scrollTo({left:card.offsetLeft-track.offsetLeft-(track.clientWidth-card.offsetWidth)/2,behavior:'smooth'})}
 function refresh(){if(counter)counter.textContent=(current()+1)+' / '+cards.length}
 document.querySelector('.carousel-prev')?.addEventListener('click',()=>goto(current()-1));
 document.querySelector('.carousel-next')?.addEventListener('click',()=>goto(current()+1));
 track.addEventListener('scroll',refresh,{passive:true});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();goto(current()-1)}if(e.key==='ArrowRight'){e.preventDefault();goto(current()+1)}});
 refresh();
})();