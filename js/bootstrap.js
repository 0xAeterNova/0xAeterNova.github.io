(function(){
  const qs=(s)=>document.querySelector(s);
  const boot=()=>qs('#boot');
  const warn=()=>qs('#boot-warning');
  function setWarning(text){
    const w=warn(); if(!w)return; w.hidden=false; w.textContent=text;
  }
  function queueIntent(withSound){
    if(window.__AETER_APP_READY__ && typeof window.AeterNovaEnter==='function') return;
    window.__AETER_BOOT_INTENT__=!!withSound;
    const b=boot(); if(b)b.classList.add('starting');
    const btn=qs(withSound?'#enter-sound':'#enter-silent');
    if(btn){btn.dataset.original=btn.textContent;btn.textContent='INITIALIZING…';}
    setTimeout(()=>{
      if(window.__AETER_APP_READY__)return;
      if(location.protocol==='file:'){
        setWarning('LOCAL FILE MODE DETECTED — run START-PORTFOLIO.bat, then open http://127.0.0.1:8080. The buttons are alive; browser module security is blocking the 3D app.');
      }else{
        setWarning('THE APP ENGINE HAS NOT STARTED YET. Check the browser console/network or use START-PORTFOLIO.bat. The interface will recover automatically if the engine becomes available.');
      }
      if(btn)btn.textContent=btn.dataset.original||'ENTER';
      if(b)b.classList.remove('starting');
    },2200);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const sound=qs('#enter-sound'),silent=qs('#enter-silent');
    sound&&sound.addEventListener('click',()=>queueIntent(true),{capture:true});
    silent&&silent.addEventListener('click',()=>queueIntent(false),{capture:true});
    if(location.protocol==='file:') setWarning('TIP: this experience uses browser modules. For the full 3D version, launch it with START-PORTFOLIO.bat instead of double-clicking index.html.');
  });
  window.addEventListener('aeter-app-ready',()=>{
    const pending=window.__AETER_BOOT_INTENT__;
    if(pending===undefined)return;
    delete window.__AETER_BOOT_INTENT__;
    if(typeof window.AeterNovaEnter==='function') window.AeterNovaEnter(!!pending);
  });
  window.addEventListener('error',e=>{
    if(!window.__AETER_APP_READY__ && e?.message) setWarning('STARTUP ERROR: '+e.message);
  });
  window.addEventListener('unhandledrejection',e=>{
    if(!window.__AETER_APP_READY__){
      const msg=e?.reason?.message||String(e?.reason||'Unknown module error');
      setWarning('STARTUP ERROR: '+msg);
    }
  });
})();
