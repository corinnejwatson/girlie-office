// ---------- FUN ZONE: disco floor, DJ booth, boombox, sushi bar (original pixel art)
const DANCE={x0:528,y0:408,cols:8,rows:5};
const BALL={x:656,y:382,r:11};
const SUSHI={x0:28,x1:468,top:510,front:542,base:566};
const BELT={x0:43,x1:453,y0:517,y1:535};
const SEATS=[78,150,222,294,366,438].map(x=>({x,y:532,who:null}));
const BOOMBOX={x0:896,y0:500,w:64,h:36};
const NEON=['#ff6fb5','#9ad8ff','#c45cf0','#7dffcf','#fff07a','#ff9a5c','#b8a8ff'];
let party=false; const FLOATS=[];
function addFun(){
  CUSTOM.push({base:410,draw:drawTruss}); block(528,392,544,412); block(778,392,794,412);
  CUSTOM.push({base:409,draw:drawBooth}); block(608,388,704,410);
  CUSTOM.push({base:422,draw:()=>{ if(!PORTRAIT) speaker(478,382); }}); block(478,402,510,424);
  CUSTOM.push({base:422,draw:()=>speaker(802,382)}); block(802,402,834,424);
  CUSTOM.push({base:540,draw:drawBoombox}); block(888,520,968,544);
  CUSTOM.push({base:578,draw:()=>beanbag(852,560,'#ff9ad5','#c23c80')}); block(832,552,872,580);
  CUSTOM.push({base:578,draw:()=>beanbag(1000,560,'#c9a8ff','#7a4ab8')}); block(980,552,1020,580);
  CUSTOM.push({base:508,draw:drawNoren}); block(26,486,38,510); block(458,486,470,510);
  CUSTOM.push({base:SUSHI.base,draw:drawCounter}); block(SUSHI.x0-2,SUSHI.front-2,SUSHI.x1+2,SUSHI.base+4);
  SEATS.forEach(s=>{ CUSTOM.push({base:586,draw:()=>stool(s.x)}); block(s.x-8,572,s.x+8,588); });
}
function beanbag(x,y,c,o){
  ctx.fillStyle='rgba(120,70,160,.25)'; ctx.beginPath(); ctx.ellipse(x,y+16,22,5,0,0,7); ctx.fill();
  ctx.fillStyle=o; ctx.beginPath(); ctx.ellipse(x,y+4,22,14,0,0,7); ctx.fill();
  ctx.fillStyle=c; ctx.beginPath(); ctx.ellipse(x,y+3,20,12,0,0,7); ctx.fill();
  ctx.fillStyle=tintW(c,.4); ctx.beginPath(); ctx.ellipse(x-6,y-2,8,4,0,0,7); ctx.fill(); px(x-3,y+6,6,1,o);
}
function tintW(hex,f){ const n=parseInt(hex.slice(1),16); const m=v=>Math.round(v+(255-v)*f); return 'rgb('+m(n>>16)+','+m((n>>8)&255)+','+m(n&255)+')'; }
function drawDanceFloor(t){
  const {x0,y0,cols,rows}=DANCE, on=musicOn(), pulse=on?Math.max(0,1-beatPhase()*2.2):0;
  px(x0-4,y0-4,cols*32+8,rows*32+8,'#fff'); px(x0-2,y0-2,cols*32+4,rows*32+4,'#c45cf0');
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const lit=((i+j)%2===0), k=Math.floor((on?beatCount():t*(party?4:2))+i*0.7+j*1.3+(lit?0:3)), c=NEON[k%NEON.length], x=x0+i*32, y=y0+j*32;
    px(x,y,32,32,lit?(pulse>.4?tintW(c,.35*pulse):c):tintW(c,.55-.25*pulse));
    px(x+2,y+2,28,2,'rgba(255,255,255,.55)'); px(x+2,y+2,2,28,'rgba(255,255,255,.35)');
    px(x,y+30,32,2,'rgba(60,20,90,.35)'); px(x+30,y,2,32,'rgba(60,20,90,.35)');
  }
  for(let n=0;n<12;n++){ const a=t*(party||on?1.6:.7)+n*2.4, rr=30+((n*37)%80);
    const sx=BALL.x+Math.cos(a)*rr*1.3, sy=y0+64+Math.sin(a)*rr*.5;
    if(sx>x0&&sx<x0+cols*32-4&&sy>y0&&sy<y0+rows*32-4){ px(sx|0,sy|0,3,3,'rgba(255,255,255,.85)'); px((sx|0)-1,(sy|0)+1,5,1,'rgba(255,255,255,.5)'); } }
}
function drawTruss(){
  for(const x of [532,776]){ px(x,364,8,48,'#d8c4f0'); px(x+2,364,2,48,'#ffffff'); px(x-2,406,12,6,'#9a7ab8'); }
  px(530,360,256,8,'#ff9ad5'); px(530,360,256,2,'#ffd6f0'); px(530,366,256,2,'#c23c80'); for(let x=536;x<782;x+=10) px(x,362,2,4,'#c23c80');
  px(655,368,2,4,'#9a7ab8');
}
function drawBall(t){
  const {x,y,r}=BALL, fast=party||musicOn();
  for(let yy=-r;yy<=r;yy+=3)for(let xx=-r;xx<=r;xx+=3){ if(xx*xx+yy*yy>r*r) continue;
    const k=(Math.floor(t*(fast?10:6))+((xx+yy+40)/3|0))%7; px(x+xx-1,y+yy-1,3,3,k===0?'#ffffff':k<3?'#e8e4ff':k<5?'#b8b0d8':'#8a80b0'); }
  px(x-5,y-6,3,3,'#ffffff'); ctx.strokeStyle='#5a4a7a'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x+.5,y+.5,r+1,0,7); ctx.stroke();
  for(let n=0;n<4;n++){ const a=t*2+n*1.7; if(Math.sin(a*3)>.3) sparkle((x+Math.cos(a)*(r+6))|0,(y+Math.sin(a)*(r+4))|0,2,'#ffffff'); }
}
function speaker(x,y){
  roundRect(x,y,32,40,3,'#3a2a4a','#1a1022');
  const p=musicOn()?(beatPhase()<.3?2:0):((Math.floor(perf*(party?8:2))%2)?1:0);
  ctx.fillStyle='#ff6fb5'; ctx.beginPath(); ctx.arc(x+16,y+26,8+p,0,7); ctx.fill();
  ctx.fillStyle='#2a1a3a'; ctx.beginPath(); ctx.arc(x+16,y+26,4,0,7); ctx.fill();
  ctx.fillStyle='#9ad8ff'; ctx.beginPath(); ctx.arc(x+16,y+10,4,0,7); ctx.fill();
}
function drawBooth(){
  const X=608,Y=374;
  roundRect(X,Y,96,34,4,'#ff9ad5','#c23c80'); px(X+4,Y,88,8,'#5b2a86'); px(X+4,Y+6,88,2,'#3a1a5a');
  for(const cx of [X+22,X+74]){ ctx.fillStyle='#1a1022'; ctx.beginPath(); ctx.ellipse(cx,Y+3,9,3,0,0,7); ctx.fill(); const a=perf*(musicOn()?12:6); px(cx+Math.cos(a)*5|0,Y+2+Math.sin(a)|0,2,1,'#ff6fb5'); }
  px(X+44,Y+1,8,4,'#7dffcf'); heart(X+36,Y+16,'#ffffff'); ctx.font='8px Silk'; ctx.fillStyle='#ffffff'; ctx.fillText('DJ',X+48,Y+24);
  for(let i=0;i<6;i++) px(X+10+i*14,Y+28,8,2,NEON[(i+Math.floor(perf*3))%NEON.length]);
}
function drawBoombox(){
  const on=musicOn(), b=on?(beatPhase()<.25?-3:0):0, {x0,y0,w,h}=BOOMBOX, y=y0+b;
  ctx.fillStyle='rgba(120,70,160,.25)'; ctx.beginPath(); ctx.ellipse(x0+w/2,y0+h+2,30,4,0,0,7); ctx.fill();
  px(x0+12,y-6,40,3,'#9a7ab8'); px(x0+12,y-6,3,8,'#9a7ab8'); px(x0+49,y-6,3,8,'#9a7ab8'); // handle
  roundRect(x0,y,w,h,6,'#ff9ad5','#a02a6a'); px(x0+3,y+3,w-6,2,'#ffd6f0');
  for(const cx of [x0+14,x0+50]){ const p=on&&beatPhase()<.3?1:0; ctx.fillStyle='#5b2a86'; ctx.beginPath(); ctx.arc(cx,y+21,10+p,0,7); ctx.fill();
    ctx.fillStyle='#c45cf0'; ctx.beginPath(); ctx.arc(cx,y+21,6,0,7); ctx.fill(); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(cx-2,y+19,2,0,7); ctx.fill(); }
  px(x0+26,y+8,12,7,'#bff0ff'); px(x0+27,y+9,10,5,on?'#7dffcf':'#9ad8ff');
  if(on){ ctx.font='6px Silk'; ctx.fillStyle='#3a1a5a'; ctx.fillText('POP',x0+27,y+14); }
  for(let i=0;i<4;i++) px(x0+26+i*3,y+18,2,2,on&&i===beatCount()%4?'#fff07a':'#ffffff');
  px(x0+26,y+24,12,6,'#a02a6a'); for(let i=0;i<4;i++) px(x0+27+i*3,y+25,2,4,'#ff6fb5');
  ctx.font='8px Silk'; ctx.textAlign='center'; ctx.fillStyle='#7a2f9e'; ctx.fillText(on?'♪ click = mute ♪':(MUS.started?'muted · click ♪':'click 2 play'),x0+w/2,y0+h+14); ctx.textAlign='left';
}
const NOTES=[]; let noteClock=0;
function drawNotes(dt){
  if(musicOn()){ noteClock-=dt; if(noteClock<=0){ noteClock=.45; NOTES.push({x:BOOMBOX.x0+10+Math.random()*44,y:BOOMBOX.y0-4,t:0,c:NEON[(Math.random()*NEON.length)|0],s:Math.random()<.5?'♪':'♫'}); } }
  ctx.font='10px Silk';
  for(const n of NOTES){ n.t+=dt; ctx.fillStyle=n.c; ctx.globalAlpha=Math.max(0,1-n.t/2); ctx.fillText(n.s,n.x+Math.sin(n.t*4)*4,n.y-n.t*22); }
  ctx.globalAlpha=1; while(NOTES.length&&NOTES[0].t>2) NOTES.shift();
}
function drawNoren(){
  for(const x of [28,460]){ px(x,444,8,66,'#8a5a3a'); px(x+2,444,2,66,'#b07a50'); }
  px(24,440,448,8,'#6a3a22'); px(24,440,448,2,'#a0603a');
  const cols=['#ff9ad5','#9ad8ff','#ff9ad5','#9ad8ff','#ff9ad5'];
  for(let i=0;i<5;i++){ const x=44+i*82, sway=Math.round(Math.sin(perf*1.5+i));
    px(x,448,76,22+sway,cols[i]); px(x,448,76,2,'#ffffff'); px(x+74,448,2,22+sway,'rgba(0,0,0,.15)');
    if(i===2){ ctx.font='8px Silk'; ctx.fillStyle='#c23c80'; ctx.textAlign='center'; ctx.fillText('すし ♡ sushi',x+38,462); ctx.textAlign='left'; }
    else { ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(x+38,459,4,0,7); ctx.fill(); px(x+36,457,4,4,i%2?'#ff6fb5':'#5fc8ff'); } }
}
const SUSHI_KINDS=['salmon','tuna','tamago','maki','ebi','cucumber','salmon','maki','tamago','tuna','ebi','salmon','cucumber','maki','tamago','ebi','tuna','maki'];
const PLATE_COLS=['#ff6fb5','#9ad8ff','#fff07a','#7dffcf','#c45cf0','#ffffff'];
function beltPos(s){ const w=BELT.x1-BELT.x0,h=BELT.y1-BELT.y0,P=2*(w+h); s=((s%P)+P)%P;
  if(s<w) return {x:BELT.x0+s,y:BELT.y1}; s-=w; if(s<h) return {x:BELT.x1,y:BELT.y1-s}; s-=h; if(s<w) return {x:BELT.x1-s,y:BELT.y0}; s-=w; return {x:BELT.x0,y:BELT.y0+s}; }
function drawCounter(){
  const {x0,x1,top,front,base}=SUSHI;
  px(x0,top,x1-x0,front-top,'#f6e2c8'); px(x0,top,x1-x0,2,'#fff6ea');
  px(x0,front,x1-x0,base-front,'#c88a5a'); px(x0,front,x1-x0,2,'#8a5a3a');
  for(let x=x0+8;x<x1-8;x+=24){ px(x,front+6,16,10,'#b07a50'); px(x+6,front+9,4,4,'#ff9ad5'); } px(x0,base-2,x1-x0,2,'#6a3a22');
  ctx.strokeStyle='#8a80a8'; ctx.lineWidth=10; ctx.strokeRect(BELT.x0,BELT.y0,BELT.x1-BELT.x0,BELT.y1-BELT.y0);
  ctx.strokeStyle='#b8b0d0'; ctx.lineWidth=1; ctx.strokeRect(BELT.x0-5.5,BELT.y0-5.5,BELT.x1-BELT.x0+11,BELT.y1-BELT.y0+11); ctx.strokeRect(BELT.x0+4.5,BELT.y0+4.5,BELT.x1-BELT.x0-9,BELT.y1-BELT.y0-9);
  const P=2*((BELT.x1-BELT.x0)+(BELT.y1-BELT.y0)), offs=(perf*14)%12; for(let s=offs;s<P;s+=12){ const p=beltPos(s); px(p.x|0,p.y|0,1,1,'#6a6088'); }
  px(BELT.x0+6,BELT.y0+6,BELT.x1-BELT.x0-12,BELT.y1-BELT.y0-12,'#f0d4b4');
  for(const x of [100,190,280,370]){ px(x,BELT.y0+7,4,4,'#5a2a1a'); px(x+8,BELT.y0+6,5,5,'#7dbf7a'); }
  const n=SUSHI_KINDS.length; const plates=[...Array(n)].map((_,i)=>({i,...beltPos(perf*14+i*P/n)})).sort((a,b)=>a.y-b.y);
  for(const p of plates) plate(Math.round(p.x),Math.round(p.y),SUSHI_KINDS[p.i],GOLD.on&&p.i===GOLD.i?'#ffc820':PLATE_COLS[p.i%PLATE_COLS.length]);
  ctx.font='8px Silk'; ctx.textAlign='center'; roundRect(184,front+5,128,14,6,'#ffffff','#ff6fb5'); ctx.fillStyle='#c23c80'; ctx.fillText('🍣 SUSHI-GO-ROUND ♡',248,front+15); ctx.textAlign='left';
}
function plate(x,y,kind,col){
  ctx.fillStyle='rgba(60,30,80,.25)'; ctx.beginPath(); ctx.ellipse(x,y+2,6,2,0,0,7); ctx.fill();
  ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(x,y,6,2.5,0,0,7); ctx.fill(); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.ellipse(x,y-.5,4,1.5,0,0,7); ctx.fill();
  if(kind==='maki'||kind==='cucumber'){ px(x-3,y-5,6,5,'#1e3a24'); px(x-2,y-5,4,2,'#ffffff'); px(x-1,y-5,2,1,kind==='maki'?'#ff9a5c':'#7dd87a'); }
  else { px(x-4,y-3,8,3,'#fffaf0'); px(x-4,y-5,8,2,{salmon:'#ff9a5c',tuna:'#e0405a',tamago:'#ffd84a',ebi:'#ffb0a0'}[kind]);
    if(kind==='salmon'){ px(x-2,y-5,1,2,'#ffd0b0'); px(x+1,y-5,1,2,'#ffd0b0'); } if(kind==='tamago') px(x-1,y-5,2,3,'#1e3a24'); if(kind==='ebi') px(x+3,y-6,2,2,'#ff7a6a'); }
}
function stool(x){ const Y=576; px(x-1,Y+1,2,8,'#9a7ab8'); ctx.fillStyle='#ff9ad5'; ctx.beginPath(); ctx.ellipse(x,Y,8,3,0,0,7); ctx.fill(); px(x-5,Y-1,6,1,'#ffd6f0'); px(x-5,Y+9,10,2,'#9a7ab8'); }
function danceSpot(i){ const s=[[576,458],[728,458],[624,506],[700,506],[566,556],[744,556]]; return s[i%s.length]; }
function freeSeat(){ const f=SEATS.filter(s=>!s.who); return f.length?f[(Math.random()*f.length)|0]:null; }
function toParty(on){
  party=on; partyT=15;
  dolls.forEach((d,i)=>{ if(d.seat){ d.seat.who=null; d.seat=null; } if(on){ const [x,y]=danceSpot(i); goTo(d,x,y,'party',null,null,'dance'); } else goHome(d); });
  FLOATS.push({x:BALL.x,y:BALL.y-28,text:on?'✧ PARTY MODE ON ✧':'party\'s over ♡ back to work',t:2.5});
}
const SUSHI_LINES=['🍣 tamago coming around!','🍣 salmon nigiri, yum','🍣 maki on the pink plate!','🍣 it never stops ♡','🍣 ebi just went by!','🍣 grab a plate, babe'];
function drawFloats(dt){
  const L=LF;
  for(const fl of FLOATS){ fl.t-=dt; ctx.font=Math.round(8*L)+'px Silk'; const o=PHONE?toOut(fl.x,fl.y+24):{x:fl.x,y:fl.y+24};
    const tw=ctx.measureText(fl.text).width+12*L, bh=Math.round(15*L), bx=Math.max(4,Math.min(OW-tw-4,(o.x-tw/2)|0)), by=(o.y-24*L-Math.max(0,Math.min(10,(2.5-fl.t)*4))*L)|0;
    roundRect(bx+.5,by+.5,tw|0,bh,6*L,'#ffffff','#c45cf0'); ctx.fillStyle='#7a2f9e'; ctx.textAlign='center'; ctx.fillText(fl.text,bx+tw/2,by+Math.round(bh*.7)); ctx.textAlign='left'; }
  for(let i=FLOATS.length-1;i>=0;i--) if(FLOATS[i].t<=0) FLOATS.splice(i,1);
}
// ---------- DRESSING ROOM (top right)
const BOOTH={x0:982,x1:1038,y0:128,y1:236,cx:1010,door:{x:1010,y:262}};
const DRESS_AREA={x0:808,y0:100,x1:1048,y1:332};
let curtainSway=0; const POOFS=[];
function poof(x,y){ for(let i=0;i<14;i++){ const a=Math.random()*7, s=20+Math.random()*30; POOFS.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,t:0,c:NEON[(Math.random()*NEON.length)|0]}); } }
function drawPoofs(dt){ for(const p of POOFS){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=20*dt; const s=p.t<.4?2:1; ctx.globalAlpha=Math.max(0,1-p.t/1.1); sparkle(p.x|0,p.y|0,s,p.c); }
  ctx.globalAlpha=1; for(let i=POOFS.length-1;i>=0;i--) if(POOFS[i].t>1.1) POOFS.splice(i,1); }
function addDressing(){
  CUSTOM.push({base:186,draw:drawBackdrop}); block(812,160,978,190);
  CUSTOM.push({base:206,draw:drawVanity}); block(816,190,880,208);
  CUSTOM.push({base:222,draw:()=>{ ctx.fillStyle='#ff9ad5'; ctx.beginPath(); ctx.ellipse(848,216,9,3,0,0,7); ctx.fill(); px(847,218,2,5,'#9a7ab8'); }}); block(838,210,858,226);
  CUSTOM.push({base:234,draw:drawRack}); block(898,216,966,236);
  CUSTOM.push({base:238,draw:drawBooth2}); block(978,218,1046,242);
}
function drawDressRug(){
  roundRect(810,180,236,148,16,'#ffc8e6'); roundRect(815,185,226,138,13,'#ffb0da');
  for(let y=200;y<318;y+=16)for(let x=826+((y/16)%2?8:0);x<1034;x+=16) sparkle(x,y,1,'#ffe6f4');
  const sy=PORTRAIT?306:104; ctx.font='8px Silk'; ctx.textAlign='center'; roundRect(862,sy,140,14,6,'#ffffff','#c45cf0'); ctx.fillStyle='#c23c80'; ctx.fillText('✧ DRESSING ROOM ✧',932,sy+10); ctx.textAlign='left';
}
function drawBackdrop(){
  px(812,122,166,62,'#e8d0ff'); for(let x=812;x<978;x+=12) px(x,122,5,62,'#f2e4ff'); px(812,122,166,3,'#c9a8ff'); px(812,180,166,4,'#ffffff');
  // mirror with bulb lights
  roundRect(822,126,50,52,6,'#fff6c0','#c8a040'); px(827,131,40,42,'#cfe8ff'); px(830,134,7,24,'#ffffff'); px(839,134,3,12,'#eef8ff');
  for(let i=0;i<6;i++){ const on=(Math.floor(perf*3)+i)%6!==0; for(const [bx,by] of [[824+i*9,127],[824+i*9,175]]) { px(bx,by,3,3,on?'#fff8d0':'#e0c880'); if(on) px(bx+1,by-1,1,1,'#ffffff'); } }
  for(let i=1;i<5;i++){ px(823,127+i*10,3,3,'#fff8d0'); px(868,127+i*10,3,3,'#fff8d0'); }
  // pinned polaroids
  for(const [x,y,c] of [[880,130,'#ff9ad5'],[880,150,'#9ad8ff']]){ px(x,y,12,14,'#ffffff'); px(x+1,y+1,10,9,c); heart(x+3,y+3,'#ffffff'); }
}
function drawVanity(){
  px(816,184,62,6,'#ffd6f0'); px(816,184,62,2,'#ffffff'); px(818,190,58,16,'#ff9ad5'); px(818,190,58,2,'#c23c80');
  px(826,194,16,8,'#ffb0da'); px(852,194,16,8,'#ffb0da'); px(833,197,2,2,'#fff07a'); px(859,197,2,2,'#fff07a'); px(820,204,3,4,'#c23c80'); px(871,204,3,4,'#c23c80');
  px(822,178,3,7,'#ff3f8f'); px(822,177,3,2,'#ffd0e8'); px(830,180,5,5,'#c9a8ff'); px(831,178,3,2,'#ffffff'); px(840,181,7,3,'#ffd6f0'); px(854,178,4,7,'#7dffcf'); px(855,176,2,2,'#ffffff'); px(864,180,6,4,'#fff07a');
}
const RACK_CLOTHES=[['#ff5fa2','tee'],['#a8d8ff','dress'],['#c45cf0','tee'],['#fff07a','skirt'],['#7dfcd0','dress'],['#24202c','tee'],['#ffffff','dress'],['#ff9a5c','skirt']];
function drawRack(){
  px(900,134,3,98,'#c0c0d0'); px(962,134,3,98,'#c0c0d0'); px(898,132,69,3,'#e8e8f8'); px(896,230,10,3,'#9a9aaa'); px(958,230,10,3,'#9a9aaa');
  RACK_CLOTHES.forEach(([c,k],i)=>{ const x=906+i*7, sw=Math.round(Math.sin(perf*1.2+i)*.6); px(x+2,135,1,3,'#9a9aaa');
    if(k==='tee'){ px(x-1+sw,138,8,4,c); px(x+sw,142,6,12,c); px(x+sw,138,6,1,'#ffffff'); }
    else if(k==='dress'){ px(x+1+sw,138,4,8,c); px(x+sw,146,6,10,c); px(x-1+sw,154,8,6,c); }
    else { px(x+sw,138,6,4,'#ffffff'); px(x-1+sw,142,8,8,c); }
    px(x+5+sw,140,1,10,'rgba(0,0,0,.18)'); });
  ctx.font='6px Silk'; ctx.fillStyle='#a02a6a'; ctx.fillText('xoxo',916,176);
  for(let i=0;i<4;i++) px(906+i*14,222,10,8,['#ff6fb5','#ffffff','#c45cf0','#9ad8ff'][i]); // shoe boxes
}
function drawBooth2(){
  const {x0,x1,y0,y1}=BOOTH; px(x0-2,y0-4,x1-x0+4,4,'#c0c0d0'); px(x0-2,y0-4,2,y1-y0+8,'#c0c0d0');
  const sway=curtainSway>0?Math.sin(perf*14)*2:Math.sin(perf*1.3)*.6; curtainSway=Math.max(0,curtainSway-0.02);
  for(let i=0;i<8;i++){ const x=x0+i*7+Math.round(sway*(i/7)); px(x,y0,7,y1-y0,i%2?'#ff6fb5':'#ff8fc8'); px(x,y0,1,y1-y0,'#ffd0e8'); }
  for(let i=0;i<8;i++) px(x0+i*7+2,y0-3,3,3,'#ffffff');
  px(x0,y1-8,x1-x0,8,'#e05aa0'); for(let x=x0+2;x<x1-2;x+=6) heart(x,y1-6,'#ffd6f0');
  if(dolls.some(d=>d.state==='changing')){ ctx.font='8px Silk'; ctx.fillStyle='#c23c80'; ctx.textAlign='center'; ctx.fillText('✧ busy ✧',BOOTH.cx,y0+40); ctx.textAlign='left'; }
}
function drawSofa(){
  ctx.fillStyle='rgba(120,70,160,.25)'; ctx.beginPath(); ctx.ellipse(640,302,66,6,0,0,7); ctx.fill();
  roundRect(586,252,108,30,8,'#ff9ad5','#c23c80'); px(592,256,96,3,'#ffc8e6');
  for(let i=0;i<4;i++){ px(600+i*26,264,3,3,'#e05aa0'); }
  roundRect(582,276,116,20,6,'#ffb0da','#c23c80'); px(588,279,104,2,'#ffe0f2'); px(640,278,1,16,'#e05aa0');
  roundRect(574,264,16,32,6,'#ff8fc8','#c23c80'); roundRect(690,264,16,32,6,'#ff8fc8','#c23c80'); px(578,267,8,2,'#ffd0e8'); px(694,267,8,2,'#ffd0e8');
  px(580,296,4,5,'#9a7ab8'); px(696,296,4,5,'#9a7ab8');
  roundRect(604,262,22,14,5,'#fff6a8','#d8b840'); heart(611,266,'#ff6fb5'); roundRect(656,262,22,14,5,'#bfe4ff','#7ab0d8'); sparkle(667,269,2,'#ffffff');
}
// ---------- BOBA BAR (top middle)
function addBoba(){ CUSTOM.push({base:176,draw:drawBoba}); block(530,140,758,180); }
function drawBobaMenu(){
  roundRect(560,14,160,62,8,'#fffaf0','#7dcfb0'); px(564,18,152,12,'#7dffcf');
  ctx.font='8px Silk'; ctx.textAlign='center'; ctx.fillStyle='#1f7a5a'; ctx.fillText('✧ BOBA BAR ✧',640,27);
  ctx.font='6px Silk'; ctx.fillStyle='#7a2f9e';
  [['taro milk tea','♡'],['strawberry matcha','♡'],['brown sugar','♡']].forEach(([n],i)=>ctx.fillText(n,640,42+i*11)); ctx.textAlign='left';
}
function cup(x,y,c){ px(x,y,8,12,'#ffffffcc'); px(x+1,y+3,6,8,c); for(let i=0;i<3;i++) px(x+1+i*2,y+9,1,1,'#3a2030'); px(x,y-1,8,1,'#ffffff'); px(x+5,y-6,1,6,'#ff6fb5'); }
function drawBoba(){
  px(532,118,224,30,'#d8fff0'); px(532,118,224,3,'#ffffff');
  px(532,148,224,28,'#7dcfb0'); px(532,148,224,2,'#4fa88a'); for(let x=540;x<752;x+=18) px(x,154,10,16,'#a8f0d8'); px(532,174,224,2,'#3f8a70');
  // machines + jars + cups on the counter
  roundRect(542,96,30,26,3,'#c0c0d0','#8a8aa0'); px(548,102,18,8,'#9ad8ff'); px(554,114,6,6,'#5a5a70');
  for(const [x,c] of [[584,'#e8c8a0'],[602,'#c9a8ff'],[620,'#ffb0c8']]){ px(x,104,14,16,'#ffffffaa'); px(x+1,110,12,9,c); px(x+2,103,10,2,'#ff9ad5'); }
  cup(652,106,'#c9a8ff'); cup(668,106,'#ffb0c8'); cup(684,106,'#e8c8a0');
  roundRect(712,100,34,20,3,'#ff9ad5','#c23c80'); px(718,104,22,6,'#fff6ea'); ctx.font='6px Silk'; ctx.fillStyle='#a02a6a'; ctx.fillText('$',726,116);
  if(typeof drawBottle==='function') drawBottle();
}
function randomLook(key){
  const pick=a=>a[(Math.random()*a.length)|0], base=lookFor(key);
  base.top=pick(Object.keys(TOPS)); base.topColor=pick(TOP_COLORS);
  if(base.top==='babytee') base.print=pick(Object.keys(PRINTS));
  base.bottom=pick(Object.keys(BOTTOMS)); base.bottomColor=pick(BOTTOM_COLORS)[0];
  const extras=['sunglasses','tiara','headband','clips','hoops','choker','bag']; const n=1+((Math.random()*3)|0), acc=new Set();
  for(let i=0;i<n;i++) acc.add(pick(extras)); if(Math.random()<.6) acc.add('belt'); base.acc=[...acc];
  if(Math.random()<.35) base.hair=pick(Object.keys(HAIRS)); if(Math.random()<.3) base.hairStyle=pick(Object.keys(HAIRSTYLES));
  if(Math.random()<.25) base.hat=pick(Object.keys(HATS)); base.shoe=pick(['#ff9ad5','#ffffff','#1a1a22','#c0c0d0','#c45cf0','#ff6fb5']);
  return base;
}
function autoRestyle(d){ if(SAVED[d.b.key]) return false; setLook(d,randomLook(d.b.key)); if(cardDoll===d) openCard(d); return true; }
