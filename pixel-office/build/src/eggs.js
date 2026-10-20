// ---------- EASTER EGGS (unsignposted; all transient, nothing permanent is drawn unless you trigger it)
// 1 disco ball x5 = mega party   2 Konami code / tap the title x5 = synchronized dance   3 type the secret word (OFFICE.secret) / tap the wall sign = night mode
// 8 tap the genie bottle on the boba bar = genie boss (genie.js)
// 5 rare golden sushi plate, tap it   6 tap Mochi x7 = spin
const CONF=[]; let NIGHT=false, SYNC=0;
const GOLD={on:false,i:0,t:30+Math.random()*30};
const taps={};
function tapCount(k,win){ const now=perf, a=(taps[k]=(taps[k]||[]).filter(t=>now-t<win)); a.push(now); return a.length; }
function sfx(kind){ if(!musicOn()||!MUS.ac) return; const t=MUS.ac.currentTime+.01;
  if(kind==='chime') [0,4,7,12,16].forEach((s,i)=>pluck(t+i*.07,NOTE('C6')*Math.pow(2,s/12),.06));
  else if(kind==='pop') pluck(t,NOTE('A5'),.07);
  else if(kind==='genie') [0,3,7,10,14,19].forEach((s,i)=>pluck(t+i*.05,NOTE('D5')*Math.pow(2,s/12),.04));
  else if(kind==='spin') [0,7,12,7,0].forEach((s,i)=>pluck(t+i*.06,NOTE('E5')*Math.pow(2,s/12),.05));
  else if(kind==='night') [12,7,4,0].forEach((s,i)=>pluck(t+i*.09,NOTE('A4')*Math.pow(2,s/12),.05)); }
function confetti(x,y,n,cols,spread){ for(let i=0;i<n;i++){ const a=-Math.PI/2+(Math.random()-.5)*(spread||2.4), s=60+Math.random()*120;
  CONF.push({x:x+(Math.random()-.5)*20,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,c:cols[(Math.random()*cols.length)|0],t:0,life:2.2+Math.random()*1.6,w:Math.random()<.5}); } }
function rainConfetti(n,cols){ for(let i=0;i<n;i++) CONF.push({x:Math.random()*WW,y:96-Math.random()*120,vx:(Math.random()-.5)*30,vy:40+Math.random()*50,c:cols[(Math.random()*cols.length)|0],t:0,life:2.5+Math.random()*1.5,w:Math.random()<.5}); }
// 1) mega party
function eggBall(){ const n=tapCount('ball',2.5); if(n<5){ if(n>=2){ burst(BALL.x,BALL.y+14); sfx('pop'); return true; } return false; } taps.ball=[];
  if(!party) toParty(true); partyT=10; rainConfetti(45,NEON); sfx('chime'); FLOATS.push({x:BALL.x,y:BALL.y-28,text:'✧ mega party ✧',t:2}); return true; }
// 2) synchronized dance
function syncDance(){ if(!party) toParty(true); partyT=10; SYNC=10; dolls.forEach(d=>d.t=0); sfx('chime');
  FLOATS.push({x:BALL.x,y:BALL.y-28,text:'✧ in sync ✧',t:2}); }
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let kIdx=0, typed='';
addEventListener('keydown',e=>{ if(!READY||e.target.closest&&e.target.closest('input,textarea')) return; const k=e.key.length===1?e.key.toLowerCase():e.key;
  kIdx=(k===KONAMI[kIdx])?kIdx+1:(k===KONAMI[0]?1:0); if(kIdx===KONAMI.length){ kIdx=0; syncDance(); }
  if(k.length===1){ typed=(typed+k).slice(-OFFICE.secret.length); if(typed===OFFICE.secret){ typed=''; toggleNight(); } } });
document.querySelector('header h1').addEventListener('click',()=>{ if(READY&&tapCount('title',3)>=5){ taps.title=[]; syncDance(); } });
// 3) night mode
function toggleNight(){ NIGHT=!NIGHT; sfx('night'); FLOATS.push({x:300,y:150,text:NIGHT?'☾ night shift ✧':'☀ good morning!',t:2.2}); }
const WALL_SIGN={x0:262,y0:76,x1:338,y1:94};
function drawNight(){
  ctx.fillStyle='rgba(28,16,72,.42)'; ctx.fillRect(0,0,WW,WH);
  const wx=332,wy=16; ctx.fillStyle='#1a1440'; ctx.fillRect(wx,wy,96,60); for(const [x,y] of [[8,8],[30,20],[70,10],[84,40],[18,46],[56,32]]) sparkle(wx+x,wy+y,(Math.floor(perf*2)+x)%3?1:0,'#fff6c0');
  ctx.fillStyle='#fff6c0'; ctx.beginPath(); ctx.arc(wx+72,wy+18,7,0,7); ctx.fill(); ctx.fillStyle='#1a1440'; ctx.beginPath(); ctx.arc(wx+75,wy+16,6,0,7); ctx.fill();
  px(wx+46,wy,4,60,'#c9b8ff'); px(wx,wy+28,96,4,'#c9b8ff');
  drawLights(perf); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=.10;
  for(let x=12;x<WW;x+=26){ const y=10+Math.abs(Math.sin(x/WW*Math.PI*6))*12; ctx.fillStyle=['#ff6fb5','#fff07a','#7dffcf','#9ad8ff','#c45cf0'][((x-12)/26)%5]; ctx.beginPath(); ctx.arc(x,y+5,10,0,7); ctx.fill(); }
  ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over'; }
// 5) golden sushi
function goldPos(){ const P=2*((BELT.x1-BELT.x0)+(BELT.y1-BELT.y0)), n=SUSHI_KINDS.length; return beltPos(perf*14+GOLD.i*P/n); }
function tapGold(){ GOLD.on=false; GOLD.t=50+Math.random()*50; const p=goldPos(); poof(p.x,p.y-6); confetti(p.x,p.y-10,16,['#ffd84a','#fff6a8','#ffffff']); sfx('pop');
  FLOATS.push({x:p.x,y:p.y-30,text:'✨ golden sushi · lucky day',t:2}); }
// 6) Mochi spin
function mochiTap(){ if(tapCount('mochi',4)<7) return false; taps.mochi=[]; AXO.spin=1.1; sfx('spin');
  AXO.bub={text:'*spins* i think, therefore i\'m cute.',by:'— Mochi (sorry, Descartes)',T:4.5}; return true; }
function eggClick(p){
  if(genieTap(p)) return true;
  if(GOLD.on){ const g=goldPos(); if(Math.hypot(p.x-g.x,p.y-g.y+3)<(PHONE?16:11)){ tapGold(); return true; } }
  if(inRect(p,WALL_SIGN)){ toggleNight(); return true; }
  return false; }
function updateEggs(dt){
  if(SYNC>0){ SYNC-=dt; if(!party) SYNC=0; } if(AXO.spin>0) AXO.spin-=dt;
  GOLD.t-=dt; if(GOLD.t<=0){ if(GOLD.on){ GOLD.on=false; GOLD.t=50+Math.random()*60; } else { GOLD.on=true; GOLD.i=(Math.random()*SUSHI_KINDS.length)|0; GOLD.t=16; } }
  for(const c of CONF){ c.t+=dt; c.vy+=70*dt; c.vx*=.99; c.x+=c.vx*dt; c.y+=Math.min(c.vy,90)*dt; }
  for(let i=CONF.length-1;i>=0;i--) if(CONF[i].t>CONF[i].life||CONF[i].y>WH) CONF.splice(i,1);
}
function drawEggs(dt){
  for(const c of CONF){ ctx.globalAlpha=Math.max(0,Math.min(1,(c.life-c.t)/.6)); const r=Math.floor(c.t*10)%2; px(Math.round(c.x),Math.round(c.y),c.w?(r?3:1):2,c.w?(r?1:3):2,c.c); }
  ctx.globalAlpha=1;
  if(GOLD.on){ const g=goldPos(); if(Math.floor(perf*4)%2) sparkle(Math.round(g.x+5),Math.round(g.y-8),1,'#ffffff'); }
}
