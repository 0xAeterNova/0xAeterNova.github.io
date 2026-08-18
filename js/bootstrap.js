(function(){
  window.__AETER_BUILD__="4.4.0-DEEP-SIGNAL";
  console.info("AETER/NOVA // BOOTSTRAP 4.4 // DEEP SIGNAL");
  const $=s=>document.querySelector(s);
  function warn(text){const w=$('#boot-warning');if(!w)return;w.hidden=false;w.textContent=text;}
  function intent(sound){
    if(typeof window.AeterNovaEnter==='function'){window.AeterNovaEnter(sound);return;}
    window.__AETER_BOOT_INTENT__=sound;
    const b=$('#boot');b?.classList.add('starting');
    const btn=$(sound?'#enter-sound':'#enter-silent');if(btn){btn.dataset.old=btn.textContent;btn.textContent='INITIALIZING LOCAL 3D…';}
    setTimeout(()=>{
      if(typeof window.AeterNovaEnter==='function')return;
      b?.classList.remove('starting');if(btn)btn.textContent=btn.dataset.old||'ENTER';
      if(location.protocol==='file:') warn('Run START-PORTFOLIO.bat instead of opening index.html directly. Browser module security blocks the local 3D engine in file:// mode.');
      else warn('The local 3D engine has not initialized. Open DIAGNOSTICS.html and send a screenshot if this persists.');
    },2500);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#enter-sound')?.addEventListener('click',()=>intent(true),{capture:true});
    $('#enter-silent')?.addEventListener('click',()=>intent(false),{capture:true});
    if(location.protocol==='file:')warn('Use START-PORTFOLIO.bat for the full 3D experience.');
  });
  window.addEventListener('aeter-app-ready',()=>{if(window.__AETER_BOOT_INTENT__!==undefined){const v=window.__AETER_BOOT_INTENT__;delete window.__AETER_BOOT_INTENT__;window.AeterNovaEnter?.(v);}});
})();
