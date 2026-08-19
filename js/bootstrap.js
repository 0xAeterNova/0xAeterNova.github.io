(function(){
  window.__AETER_BUILD__='5.0.0-NIGHT-CIRCUIT';
  console.info('AETER/NOVA // BOOTSTRAP 5.0 // NIGHT CIRCUIT');
  const $=s=>document.querySelector(s);
  const steps=['LINKING GPU','CALIBRATING CITY','SYNCING TRANSMISSION','CITY ONLINE'];
  let si=0;
  function warn(text){const w=$('#boot-warning');if(!w)return;w.hidden=false;w.textContent=text;}
  function animateStatus(){const s=$('#boot-status');if(!s)return;const tick=()=>{if(si<steps.length-1){s.textContent=steps[si++];setTimeout(tick,420);}else if(!window.AeterNovaEnter)s.textContent=steps[steps.length-1];};tick();}
  function intent(sound){
    if(typeof window.AeterNovaEnter==='function'){window.AeterNovaEnter(sound);return;}
    window.__AETER_BOOT_INTENT__=sound;
    const b=$('#boot');b?.classList.add('starting');
    const btn=$(sound?'#enter-sound':'#enter-silent');if(btn){btn.dataset.old=btn.innerHTML;btn.innerHTML='<span>INITIALIZING CITY…</span><em>LOCAL ENGINE</em>';}
    setTimeout(()=>{
      if(typeof window.AeterNovaEnter==='function')return;
      b?.classList.remove('starting');if(btn)btn.innerHTML=btn.dataset.old||'<span>ENTER</span>';
      if(location.protocol==='file:')warn('Run START-PORTFOLIO.bat instead of opening index.html directly. Browser module security blocks the local 3D engine in file:// mode.');
      else warn('The local 3D engine has not initialized. Open DIAGNOSTICS.html and send a screenshot if this persists.');
    },2800);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    animateStatus();
    $('#enter-sound')?.addEventListener('click',()=>intent(true),{capture:true});
    $('#enter-silent')?.addEventListener('click',()=>intent(false),{capture:true});
    if(location.protocol==='file:')warn('Use START-PORTFOLIO.bat for the full 3D experience.');
  });
  window.addEventListener('aeter-app-ready',()=>{if(window.__AETER_BOOT_INTENT__!==undefined){const v=window.__AETER_BOOT_INTENT__;delete window.__AETER_BOOT_INTENT__;window.AeterNovaEnter?.(v);}});
})();
