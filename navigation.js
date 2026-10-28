/* Menú y enlaces internos: posicionar exactamente el encabezado de cada sección.
   Sin desplazamiento suave para evitar saltos de Safari con imágenes/carrusel. */
(()=>{
 'use strict';
 const root=document.querySelector('.site-menu');
 const button=root?.querySelector('.menu-toggle');
 const panel=root?.querySelector('.site-menu-list');
 function close(){
  if(!panel||!button)return;
  panel.hidden=true;
  button.setAttribute('aria-expanded','false');
 }
 button?.addEventListener('click',()=>{
  const open=panel.hidden;
  panel.hidden=!open;
  button.setAttribute('aria-expanded',String(open));
 });
 document.addEventListener('click',event=>{
  if(root&&!root.contains(event.target))close();
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&panel&&!panel.hidden){close();button?.focus();}
 });
 function toSection(hash,saveHash){
  if(!hash||hash.charAt(0)!=='#')return false;
  const target=document.getElementById(decodeURIComponent(hash.slice(1)));
  if(!target)return false;
  close();
  const top=Math.max(0,window.scrollY+target.getBoundingClientRect().top);
  window.scrollTo({top:Math.round(top),behavior:'instant'});
  if(saveHash&&location.hash!==hash)history.pushState(null,'',hash);
  return true;
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const hash=link.getAttribute('href');
  if(toSection(hash,true))event.preventDefault();
 });
 window.addEventListener('hashchange',()=>toSection(location.hash,false));
 window.addEventListener('popstate',()=>toSection(location.hash,false));
 window.addEventListener('load',()=>{if(location.hash)toSection(location.hash,false)},{once:true});
})();