const asiste=document.getElementById('asiste');
const plus=document.getElementById('plus');
const bus=document.getElementById('bus');
const alergiaEstado=document.getElementById('alergiaEstado');
const alergiaPlusEstado=document.getElementById('alergiaPlusEstado');
const form=document.getElementById('rsvpForm');
const estado=document.getElementById('estado');
// Se activará exclusivamente cuando se configure la URL real /exec de Apps Script.
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbwPZp8Kp5Kw5uzvoan2vgbmtRerBSqpllzqvyNWUORUXtU653jsRwYAO2wK2Tvhep55/exec";
const byId=id=>document.getElementById(id);
function refresh(){
 const attending=asiste.value==='si', companion=attending&&plus.value==='si', usingBus=attending&&bus.value==='si';
 byId('extra').classList.toggle('hidden',!attending);
 byId('nombrePlus').classList.toggle('hidden',!companion);
 byId('alergiasAcompanante').classList.toggle('hidden',!companion);
 byId('busInfo').classList.toggle('hidden',!usingBus);
 byId('alergiasDetalle').classList.toggle('hidden',!attending||alergiaEstado.value!=='si');
 byId('alergiasPlusDetalle').classList.toggle('hidden',!companion||alergiaPlusEstado.value!=='si');
 byId('acompanante').required=companion;
 byId('alergias').required=attending&&alergiaEstado.value==='si';
 byId('alergiasPlus').required=companion&&alergiaPlusEstado.value==='si';
 alergiaPlusEstado.required=companion;
 for(const id of ['plus','bus','alergiaEstado'])byId(id).disabled=!attending;
 for(const id of ['plazas','trayecto']){byId(id).disabled=!usingBus;byId(id).required=usingBus;}
 if(!companion){alergiaPlusEstado.value='';byId('alergiasPlus').value='';byId('acompanante').value='';}
 if(!usingBus){byId('plazas').value='';byId('trayecto').value='';}
 if(!attending){plus.value='';bus.value='';alergiaEstado.value='';byId('alergias').value='';}
}
[asiste,plus,bus,alergiaEstado,alergiaPlusEstado].forEach(el=>el.addEventListener('change',refresh));refresh();
form.addEventListener('submit',e=>{
 e.preventDefault();
 const name=byId('nombre').value.trim().replace(/\\s+/g,' ');
 if(name.length<3){byId('nombre').setCustomValidity('Escribe tu nombre y apellidos.');byId('nombre').reportValidity();return;}else byId('nombre').setCustomValidity('');
 if(!form.reportValidity())return;
 if(asiste.value==='si'){
  if(!plus.value||!bus.value||!alergiaEstado.value){estado.textContent='Responde conscientemente a todas las preguntas.';return;}
  if(plus.value==='si'&&(!alergiaPlusEstado.value||byId('acompanante').value.trim().length<3)){estado.textContent='Completa los datos del acompañante.';return;}
  if((alergiaEstado.value==='si'&&!byId('alergias').value.trim())||(plus.value==='si'&&alergiaPlusEstado.value==='si'&&!byId('alergiasPlus').value.trim())){estado.textContent='Describe las alergias indicadas.';return;}
 }
 if(!APPS_SCRIPT_URL.startsWith('https://script.google.com/macros/s/')||!APPS_SCRIPT_URL.endsWith('/exec')){estado.textContent='Formulario en preparación. No se ha enviado ni guardado ninguna respuesta.';return;}
 const seats=(asiste.value==='si'&&bus.value==='si')?Number(byId('plazas').value):0;
 const trip=byId('trayecto').value;
 if(bus.value==='si'&&(seats<1||seats> (plus.value==='si'?2:1)||!trip)){estado.textContent='Comprueba las plazas y el trayecto del autocar.';return;}
 byId('plazasIda').value=seats&&(trip==='ida'||trip==='ida-vuelta')?seats:0;
 byId('plazasVuelta').value=seats&&(trip==='vuelta'||trip==='ida-vuelta')?seats:0;
 byId('nonce').value=crypto.randomUUID?crypto.randomUUID():String(Date.now());
 form.action=APPS_SCRIPT_URL;
 form.submit();
 estado.textContent='Se ha abierto la página de confirmación de Google. Comprueba que indique que los datos se han guardado.';
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