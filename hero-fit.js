/* Fit headline to its actual column, including resized windows and browser zoom. */
(()=>{'use strict';
 const heading=document.querySelector('.hero-content .hero-names');
 const content=document.querySelector('.hero .hero-content');
 if(!heading||!content)return;
 let scheduled=false;
 function fit(){
  scheduled=false;
  const available=Math.max(0,content.clientWidth-2);
  if(!available)return;
  const style=getComputedStyle(heading);
  const letter=parseFloat(style.letterSpacing)||0;
  const text=heading.textContent||'';
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('2d');
  const family=style.fontFamily;
  const weight=style.fontWeight;
  const size=Math.min(160,Math.max(22,Math.floor(available/5)));
  if(!context)return;
  // The text width is monotonic in font size; account for tracking too.
  function widthAt(px){
   context.font=weight+' '+px+'px '+family;
   return context.measureText(text).width+letter*(text.length-1);
  }
  let low=22,high=160;
  for(let i=0;i<15;i++){
   const mid=(low+high)/2;
   if(widthAt(mid)<=available*.87)low=mid;else high=mid;
  }
  heading.style.setProperty('--hero-name-size',Math.max(22,Math.min(160,low)).toFixed(2)+'px');
  // Validate against actual glyph layout once, including font fallback.
  for(let i=0;i<3&&heading.scrollWidth>heading.clientWidth+1;i++){
   const current=parseFloat(heading.style.getPropertyValue('--hero-name-size'))||low;
   heading.style.setProperty('--hero-name-size',(current*.94).toFixed(2)+'px');
  }
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(fit)}}
 if('ResizeObserver' in window){new ResizeObserver(schedule).observe(content)}else window.addEventListener('resize',schedule);
 window.addEventListener('resize',schedule);
 if(document.fonts?.ready)document.fonts.ready.then(schedule);
 schedule();
})();