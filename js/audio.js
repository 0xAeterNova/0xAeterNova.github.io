const notes={
  home:[55,82.4,110], projects:[65.4,98,130.8], cyber:[46.2,69.3,92.5], about:[73.4,110,146.8], contact:[61.7,92.5,123.5],
  ruvigil:[58.3,116.5,174.6], phantom:[69.3,103.8,138.6], elif:[49,73.4,98]
};

export class GenerativeAudio{
  constructor(){this.ctx=null;this.master=null;this.voices=[];this.enabled=false;this.realm='home';this.timer=null}
  async toggle(){
    if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=0;this.master.connect(this.ctx.destination)}
    await this.ctx.resume();this.enabled=!this.enabled;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.linearRampToValueAtTime(this.enabled?.055:0,this.ctx.currentTime+.6);
    if(this.enabled){this.rebuild(this.realm);this.startPulse()}else this.stopPulse();
    return this.enabled;
  }
  setRealm(route){this.realm=route.startsWith('project/')?(route.includes('ruvigil')?'ruvigil':route.includes('phantom')?'phantom':'elif'):route;if(this.enabled)this.rebuild(this.realm)}
  rebuild(realm){
    if(!this.ctx)return;const now=this.ctx.currentTime;
    this.voices.forEach(v=>{try{v.g.gain.linearRampToValueAtTime(0,now+.5);v.o.stop(now+.65)}catch{}});this.voices=[];
    const fs=notes[realm]||notes.home;
    fs.forEach((f,i)=>{
      const o=this.ctx.createOscillator(),g=this.ctx.createGain(),filter=this.ctx.createBiquadFilter();
      o.type=i===0?'sine':i===1?'triangle':'sine';o.frequency.value=f;filter.type='lowpass';filter.frequency.value=520+i*240;filter.Q.value=.6;
      g.gain.value=0;o.connect(filter);filter.connect(g);g.connect(this.master);o.start();g.gain.linearRampToValueAtTime(i===0?.32:.13,now+1.4+i*.2);this.voices.push({o,g});
    });
  }
  startPulse(){
    clearInterval(this.timer);this.timer=setInterval(()=>{if(!this.enabled||!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();const f=(notes[this.realm]||notes.home)[Math.floor(Math.random()*3)]*4;o.type='sine';o.frequency.value=f;g.gain.value=0;o.connect(g);g.connect(this.master);const t=this.ctx.currentTime;g.gain.linearRampToValueAtTime(.09,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.start(t);o.stop(t+.38)},1800+Math.random()*1200)
  }
  stopPulse(){clearInterval(this.timer);this.timer=null}
  blip(){if(!this.enabled||!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='square';o.frequency.value=620;g.gain.value=.025;o.connect(g);g.connect(this.master);const t=this.ctx.currentTime;o.frequency.exponentialRampToValueAtTime(180,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+.09);o.start();o.stop(t+.1)}
}
