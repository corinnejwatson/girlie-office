// ---------- MUSIC: "Glitter Cache" — an original bubblegum hyperpop track, synthesized live with Web Audio (no audio files)
// 140 bpm, F major. Sections: intro, verse, pre-chorus, chorus, post-chorus "chop" drop. Starts on the first click/keypress.
const MUS={ac:null,master:null,bpm:140,t0:0,step:0,nextT:0,timer:null,noise:null,started:false,muted:false,justStarted:false};
const NOTE=n=>{ const m=n.match(/^([A-G])([#b]?)(\d)$/); const s={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0); return 440*Math.pow(2,((+m[3]+1)*12+s-69)/12); };
const CHD={F:['F2','A3','C4','F4'],C:['C2','G3','C4','E4'],Dm:['D2','A3','D4','F4'],Bb:['Bb1','Bb3','D4','F4'],Gm:['G1','Bb3','D4','G4'],A:['A1','A3','C#4','E4']};
const SEC={
  intro:{ch:['F','C','Dm','Bb'],mel:null},
  verse:{ch:['Dm','Bb','F','C','Dm','Bb','F','C'],mel:'D5 r F5 r A5 - G5 F5 | F5 r D5 r F5 - - r | C5 r F5 r A5 - G5 A5 | G5 - E5 - C5 - r r | D5 r F5 r A5 - C6 A5 | Bb5 r A5 r F5 - D5 r | C5 r F5 r A5 - C6 D6 | G5 - A5 - Bb5 - C6 -'},
  pre:{ch:['Gm','Bb','C','C'],mel:'Bb5 - Bb5 - A5 - G5 - | D6 - D6 - C6 - Bb5 - | C6 - C6 - D6 - E6 - | G6 - - - r r r r'},
  chorus:{ch:['F','C','Dm','Bb','F','C','Dm','Bb'],mel:'C6 - A5 C6 - A5 G5 F5 | G5 - E5 G5 - C6 - - | A5 - F5 A5 - D6 C6 A5 | Bb5 - A5 G5 - F5 G5 - | C6 - A5 C6 - A5 G5 F5 | G5 - E5 G5 - C6 D6 E6 | F6 - E6 D6 - C6 A5 - | G5 A5 Bb5 - A5 - F5 -'},
  post:{ch:['F','C','Dm','Bb'],mel:null},
};
for(const k in SEC) if(SEC[k].mel) SEC[k].mel=SEC[k].mel.split(/\s+/).filter(x=>x&&x!=='|');
const SONG=[]; // flattened bars
function addSec(name){ SEC[name].ch.forEach((c,i)=>SONG.push({sec:name,ch:c,bar:i,n:SEC[name].ch.length})); }
['intro','verse','pre','chorus','post','verse','pre','chorus','post','post'].forEach(addSec);
const LOOP_FROM=4; // after the first pass, loop back to the first verse
function barAt(b){ if(b<SONG.length) return SONG[b]; return SONG[LOOP_FROM+((b-LOOP_FROM)%(SONG.length-LOOP_FROM))]; }
function musicOn(){ return MUS.started&&!MUS.muted; }
function beatRate(){ return MUS.bpm/60; }
function beatPos(){ return MUS.ac?Math.max(0,MUS.ac.currentTime-MUS.t0)*MUS.bpm/60:perf*2; }
function beatPhase(){ return beatPos()%1; }
function beatCount(){ return Math.floor(beatPos()); }
function musInit(){
  const ac=new (window.AudioContext||window.webkitAudioContext)(); MUS.ac=ac;
  const comp=ac.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=4; comp.attack.value=.004; comp.release.value=.15; comp.connect(ac.destination);
  MUS.master=ac.createGain(); MUS.master.gain.value=.42; MUS.master.connect(comp);
  MUS.duck=ac.createGain(); MUS.duck.connect(MUS.master);           // sidechained bus (pads + bass)
  MUS.dly=ac.createDelay(1); MUS.dly.delayTime.value=60/MUS.bpm*.75; const fb=ac.createGain(); fb.gain.value=.32; const lp=ac.createBiquadFilter(); lp.frequency.value=3000;
  MUS.dly.connect(lp); lp.connect(fb); fb.connect(MUS.dly); const wet=ac.createGain(); wet.gain.value=.28; lp.connect(wet); wet.connect(MUS.master);
  const len=ac.sampleRate, buf=ac.createBuffer(1,len,ac.sampleRate), d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1; MUS.noise=buf;
}
function env(g,t,a,peak,dur){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); }
function osc(type,f,t,dur,dest,detune){ const o=MUS.ac.createOscillator(); o.type=type; o.frequency.setValueAtTime(f,t); if(detune) o.detune.value=detune; o.connect(dest); o.start(t); o.stop(t+dur+.05); return o; }
function kick(t,v){ const ac=MUS.ac,g=ac.createGain(); g.connect(MUS.master); env(g,t,.002,v,.34); const o=osc('sine',170,t,.34,g); o.frequency.exponentialRampToValueAtTime(42,t+.11);
  const c=ac.createGain(); c.connect(MUS.master); env(c,t,.001,v*.35,.02); osc('square',1200,t,.02,c);
  const d=MUS.duck.gain; d.cancelScheduledValues(t); d.setValueAtTime(.22,t); d.linearRampToValueAtTime(1,t+.2); }
function noise(t,dur,v,type,f,q,dest){ const ac=MUS.ac,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain(); s.buffer=MUS.noise; fl.type=type; fl.frequency.value=f; if(q) fl.Q.value=q;
  s.connect(fl); fl.connect(g); g.connect(dest||MUS.master); s.start(t,Math.random()*.5); s.stop(t+dur+.05); return g; }
function clap(t,v){ for(let i=0;i<3;i++){ const g=noise(t+i*.011,.012,0,'bandpass',1300,.9); g.gain.setValueAtTime(v,t+i*.011); g.gain.exponentialRampToValueAtTime(.0001,t+i*.011+.012); }
  const g=noise(t+.033,.2,0,'bandpass',1200,.8); env(g,t+.033,.002,v*.8,.2); }
function hat(t,v,open){ const g=noise(t,open?.2:.04,0,'highpass',open?7000:9000); env(g,t,.001,v,open?.2:.04); }
function bass(t,f,dur,v){ const ac=MUS.ac,fl=ac.createBiquadFilter(),g=ac.createGain(); fl.type='lowpass'; fl.Q.value=6; fl.frequency.setValueAtTime(1600,t); fl.frequency.exponentialRampToValueAtTime(260,t+dur);
  fl.connect(g); g.connect(MUS.duck); env(g,t,.004,v,dur); osc('sawtooth',f,t,dur,fl); osc('square',f/2,t,dur,fl); }
function pad(t,notes,dur,v,bright){ const ac=MUS.ac,fl=ac.createBiquadFilter(),g=ac.createGain(); fl.type='lowpass'; fl.frequency.value=bright?3200:1300; fl.connect(g); g.connect(MUS.duck);
  g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.03); g.gain.setValueAtTime(v,t+dur*.8); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  notes.forEach(n=>{ const f=NOTE(n); osc('sawtooth',f,t,dur,fl,-9); osc('sawtooth',f,t,dur,fl,9); }); }
function lead(t,f,dur,v){ const ac=MUS.ac,fl=ac.createBiquadFilter(),g=ac.createGain(); fl.type='lowpass'; fl.frequency.value=5200; fl.connect(g); g.connect(MUS.master); g.connect(MUS.dly);
  g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.008); g.gain.setValueAtTime(v*.8,t+Math.max(.02,dur-.04)); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  const lfo=ac.createOscillator(), lg=ac.createGain(); lfo.frequency.value=6; lg.gain.setValueAtTime(0,t); lg.gain.linearRampToValueAtTime(dur>.3?14:0,t+dur); lfo.connect(lg); lfo.start(t); lfo.stop(t+dur+.05);
  const a=osc('square',f,t,dur,fl,0), b=osc('sawtooth',f*2,t,dur,fl,6); lg.connect(a.detune); lg.connect(b.detune);
  const sub=ac.createGain(); sub.gain.value=.5; sub.connect(fl); const c=osc('triangle',f,t-0.0001,dur,sub,-5); a.frequency.setValueAtTime(f*1.03,t); a.frequency.exponentialRampToValueAtTime(f,t+.03); }
function pluck(t,f,v){ const g=MUS.ac.createGain(); g.connect(MUS.master); g.connect(MUS.dly); env(g,t,.002,v,.12); osc('square',f,t,.12,g); osc('triangle',f*2,t,.12,g); }
function chop(t,f,v){ const ac=MUS.ac,fl=ac.createBiquadFilter(),g=ac.createGain(); fl.type='bandpass'; fl.Q.value=4; fl.frequency.setValueAtTime(900,t); fl.frequency.exponentialRampToValueAtTime(2400,t+.12);
  fl.connect(g); g.connect(MUS.master); g.connect(MUS.dly); env(g,t,.004,v,.17); const o=osc('sawtooth',f*1.06,t,.17,fl); o.frequency.exponentialRampToValueAtTime(f,t+.05); osc('square',f,t,.17,fl,8); }
function riser(t,dur,v){ const ac=MUS.ac,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain(); s.buffer=MUS.noise; s.loop=true; fl.type='bandpass'; fl.Q.value=3;
  fl.frequency.setValueAtTime(300,t); fl.frequency.exponentialRampToValueAtTime(7000,t+dur); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+dur); g.gain.linearRampToValueAtTime(0,t+dur+.02);
  s.connect(fl); fl.connect(g); g.connect(MUS.master); s.start(t); s.stop(t+dur+.05); }
function musStep(i,t){
  const s16=60/MUS.bpm/4, B=barAt(Math.floor(i/16)), k=i%16, sec=B.sec, ch=CHD[B.ch], last=B.bar===B.n-1;
  const root=NOTE(ch[0]), up=ch.slice(1);
  // drums
  if(sec==='intro'){ if(k%8===0) kick(t,.6); if(k%4===2) hat(t,.08,false); if(last&&k>=8&&k%2===0) clap(t,.12+k*.02); }
  else if(sec==='pre'){ if(k===0||k===8||(B.bar<2&&k===10)) kick(t,.85); if(k===4||k===12) clap(t,.35); if(k%2===1) hat(t,.07,false);
    if(B.bar===B.n-2&&k%4===0||last&&(k<12?k%2===0:true)) clap(t,.16+(B.bar===B.n-1?k*.018:0)); if(B.bar===B.n-1&&k===0) riser(t,s16*16,.2); }
  else { if(k%4===0) kick(t,.95); if(k===4||k===12) clap(t,.42); if(sec==='chorus'&&B.bar%2===1&&k===15) clap(t,.25);
    hat(t,k%4===2?.13:.05,sec!=='verse'&&k%4===2); }
  // bass
  if(sec==='verse'){ if([0,3,6,8,11,14].includes(k)) bass(t,root*(k===6||k===14?2:1),s16*2.2,.28); }
  else if(sec==='chorus'||sec==='post'){ if(k%4===2) bass(t,root*2,s16*1.8,.3); if(k%4===0) bass(t,root,s16*1.1,.18); }
  else if(sec==='pre'){ if(k%2===0) bass(t,root*(k%4===2?2:1),s16*1.6,.24); }
  // chords
  if(k===0){ const bright=sec==='chorus'||sec==='post'; pad(t,up,s16*16,sec==='intro'?.05:.04,bright); }
  if(sec==='chorus'||sec==='intro') pluck(t,NOTE(up[k%3])*(k%8<4?2:4),sec==='intro'?.035:.03);
  // melodies
  if(SEC[sec].mel&&k%2===0){ const m=SEC[sec].mel, idx=B.bar*8+k/2, n=m[idx];
    if(n&&n!=='-'&&n!=='r'){ let len=1; while(m[idx+len]==='-') len++; lead(t,NOTE(n),s16*2*len*.92,sec==='chorus'?.085:.07); } }
  if(sec==='post'){ const pat=[0,3,6,10,12,14], hi=[2,1,2,3,2,1]; const j=pat.indexOf(k); if(j>=0) chop(t,NOTE(up[hi[j]%3])*2*(j===3?2:1),.09); }
}
function musTick(){ const ac=MUS.ac, s16=60/MUS.bpm/4; while(MUS.nextT<ac.currentTime+.12){ musStep(MUS.step,MUS.nextT); MUS.step++; MUS.nextT+=s16; } }
function musStart(){
  if(MUS.started){ if(!MUS.muted&&!document.hidden&&MUS.ac&&MUS.ac.state!=='running') MUS.ac.resume(); return; }
  MUS.started=true; MUS.justStarted=true; setTimeout(()=>MUS.justStarted=false,700);
  try{ musInit(); MUS.ac.resume();
    // iOS unlock: play a one-sample silent buffer inside the user gesture
    const sb=MUS.ac.createBufferSource(); sb.buffer=MUS.ac.createBuffer(1,1,22050); sb.connect(MUS.ac.destination); sb.start(0);
    MUS.t0=MUS.ac.currentTime+.08; MUS.nextT=MUS.t0; MUS.timer=setInterval(musTick,25); }catch(e){ MUS.started=false; }
  uiMusic(); }
function musToggle(){ if(!MUS.started){ musStart(); return; } if(MUS.justStarted) return; MUS.muted=!MUS.muted;
  if(MUS.muted) MUS.ac.suspend(); else MUS.ac.resume(); uiMusic(); }
const mBtn=document.getElementById('mus');
const TOUCH=matchMedia('(pointer: coarse)').matches||('ontouchstart' in window);
function uiMusic(){ mBtn.classList.toggle('hint',!MUS.started); const sm=document.body.classList.contains('phone');
  mBtn.textContent=!MUS.started?(TOUCH?(sm?'♫ tap for music':'♫ tap anywhere for music'):'♫ click anywhere for music'):MUS.muted?(sm?'♪ muted':'♪ muted · tap to unmute'):(sm?'♫ on':'♫ now playing · tap to mute'); }
addEventListener('resize',uiMusic);
mBtn.addEventListener('click',e=>{ e.stopPropagation(); if(MUS.started) musToggle(); else musStart(); });
for(const ev of ['pointerdown','touchend','click']) addEventListener(ev,()=>musStart(),{capture:true,passive:true});
addEventListener('keydown',e=>{ if(e.key==='Escape') return; musStart(); },{capture:true});
document.addEventListener('visibilitychange',()=>{ if(!MUS.ac||!MUS.started) return; if(document.hidden) MUS.ac.suspend(); else if(!MUS.muted) MUS.ac.resume(); });
uiMusic();
