// ---------- drawing helpers
function px(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x,y,w,h); }
function roundRect(x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill(); if(stroke){ctx.strokeStyle=stroke; ctx.lineWidth=1; ctx.stroke();} }
function heart(x,y,c){ px(x,y,2,2,c); px(x+3,y,2,2,c); px(x,y+1,5,2,c); px(x+1,y+3,3,1,c); px(x+2,y+4,1,1,c); }
function cloud(x,y){ px(x,y,18,6,'#ffffff'); px(x+4,y-4,8,4,'#ffffff'); px(x+2,y+6,14,2,'#f4f0ff'); }
function sparkle(x,y,s,c){ px(x-s,y,2*s+1,1,c); px(x,y-s,1,2*s+1,c); if(s>1) px(x-1,y-1,3,3,c); }
function drawRoom(t){
  for(let y=96;y<WH;y+=T)for(let x=0;x<WW;x+=T){ const k=(x<480&&y>=416)?'floorK':'floor'; ctx.drawImage(IMG[k],x,y,T,T); }
  drawRugs(); drawDressRug(); drawDanceFloor(t);
  // wallpaper
  px(0,0,WW,96,'#f6d6ee'); for(let x=0;x<WW;x+=16) px(x,0,6,92,'#fbe4f4');
  for(let y=10;y<88;y+=20)for(let x=((y/20)|0)%2?8:0;x<WW;x+=32) heart(x+5,y,'#ffb0d8');
  px(0,0,WW,6,'#c9a8ff'); px(0,6,WW,2,'#e8deff'); px(0,88,WW,8,'#ffffff'); px(0,94,WW,2,'#c9a8ff'); px(0,96,WW,3,'#d8c4f0');
  const wx=332, wy=16; px(wx-4,wy-4,104,68,'#ffffff'); px(wx-2,wy-2,100,64,'#c9a8ff');
  const g=ctx.createLinearGradient(0,wy,0,wy+60); g.addColorStop(0,'#9fd8ff'); g.addColorStop(1,'#ffd6f0'); ctx.fillStyle=g; ctx.fillRect(wx,wy,96,60);
  const cx=(t*6)%140-30; ctx.save(); ctx.beginPath(); ctx.rect(wx,wy,96,60); ctx.clip(); cloud(wx+cx,wy+16); cloud(wx+((cx+70)%140)-30,wy+36); ctx.restore();
  px(wx+46,wy,4,60,'#ffffff'); px(wx,wy+28,96,4,'#ffffff'); px(wx-6,wy+60,108,5,'#ffffff'); px(wx-6,wy+64,108,2,'#c9a8ff');
  ctx.drawImage(IMG.lpaint,28,16,64,64); ctx.drawImage(IMG.spaint,112,24,32,64);
  ctx.drawImage(IMG.whiteboard,196,12,64,64);
  ctx.fillStyle='#ff6fb5'; ctx.font='6px Silk'; ctx.fillText('Q4 GTM ♡',204,32);
  px(206,42,4,6,'#5fc8ff'); px(212,38,4,10,'#c45cf0'); px(218,34,4,14,'#ff6fb5'); px(224,30,4,18,'#2fae6a');
  ctx.drawImage(IMG.hplant,156,0,32,64); ctx.drawImage(IMG.hplant,452,0,32,64); ctx.drawImage(IMG.hplant,1010,0,32,64);
  ctx.font='8px Silk'; ctx.fillStyle='#c23c80'; ctx.textAlign='center'; ctx.fillText(OFFICE.sign,300,88); ctx.textAlign='left';
  drawBobaMenu(); ctx.drawImage(IMG.clock,772,10,32,64);
  ctx.drawImage(IMG.spaint2,836,22,32,64);
  ctx.font='8px Silk'; ctx.textAlign='center'; ctx.fillStyle='#a02a6a'; ctx.fillText('♡ Y2K FOREVER ♡',940,52); ctx.textAlign='left';
  drawLights(t);
}
function drawRugs(){
  // lounge rug under the sofa
  roundRect(560,236,160,104,30,'#ffe0f2'); roundRect(566,242,148,92,26,'#ffc8e6');
  for(let i=0;i<5;i++) heart(584+i*28,322,'#ffe6f4');
  // chill-corner rug
  roundRect(812,452,232,160,40,'#d8f0ff'); roundRect(820,460,216,144,34,'#bfe4ff');
  for(let y=478;y<596;y+=20)for(let x=842+((y/20)%2?10:0);x<1020;x+=20) sparkle(x,y,1,'#e6f6ff');
}
function drawLights(t){
  // string lights draped across the wall (blink to the beat when music plays)
  const on=musicOn(), cols=['#ff6fb5','#fff07a','#7dffcf','#9ad8ff','#c45cf0'];
  ctx.strokeStyle='#8a6aa8'; ctx.lineWidth=1; ctx.beginPath();
  for(let x=0;x<=WW;x+=4){ const y=10+Math.abs(Math.sin(x/WW*Math.PI*6))*12; x?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.stroke();
  for(let i=0,x=12;x<WW;x+=26,i++){ const y=Math.round(10+Math.abs(Math.sin(x/WW*Math.PI*6))*12);
    const lit=on?((beatCount()+i)%3!==0):((Math.floor(t*1.5)+i)%4!==0), c=cols[i%cols.length];
    px(x-1,y,3,2,'#6a5a7a'); px(x-2,y+2,5,5,lit?c:tintW(c,.6)); if(lit){ px(x-1,y+3,1,1,'#ffffff'); ctx.fillStyle=c+'33'; ctx.fillRect(x-4,y,9,10); } }
}
const SPARK=[...Array(18)].map(()=>({x:Math.random()*WW,y:Math.random()*WH,p:Math.random()*6}));
function drawDoll(d){
  if(d.state==='changing') return;
  const f=frameOf(d), dx=Math.round(d.x-DW/2), dy=Math.round(d.y-FEET)+bob(d);
  ctx.fillStyle='rgba(120,70,160,.25)'; ctx.beginPath(); ctx.ellipse(d.x,d.y+1,10,3,0,0,7); ctx.fill();
  if(d===hover||d===selected){ const g=d===selected?d.glow2:d.glow;
    for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,-2],[0,2],[1,1],[-1,-1],[1,-1],[-1,1]]) ctx.drawImage(g,f*DW,0,DW,DH,dx+ox,dy+oy,DW,DH); }
  if(d.twirl>0){ ctx.save(); ctx.translate(Math.round(d.x),0); ctx.scale(Math.cos((.9-d.twirl)/.9*Math.PI*4),1); ctx.drawImage(d.img,f*DW,0,DW,DH,-DW/2,dy,DW,DH); ctx.restore(); }
  else ctx.drawImage(d.img,f*DW,0,DW,DH,dx,dy,DW,DH);
  drawVibe(d,dx,dy);
}
function drawLabels(d,i,X,Y){
  if(d.state==='changing') return;
  if(X===undefined){ X=d.x; Y=d.y; }
  const f=LF, top=Math.round(Y-FEET)+bob(d), fs=Math.round(8*f), h=Math.round(10*f);
  ctx.font=fs+'px Silk'; ctx.textAlign='center';
  const name=PHONE?d.b.plate:d.b.tag, w=ctx.measureText(name).width+8*f, tx=Math.round(Math.max(w/2+3,Math.min(OW-w/2-3,X)));
  const ty=Math.round(top-1.5*f-h);
  roundRect(Math.round(tx-w/2)+.5,ty+.5,Math.round(w),h,4*f,d===selected?'#ff6fb5':'#ffffffee',d===selected?'#c23c80':'#c9a8ff');
  ctx.fillStyle=d===selected?'#fff':'#7a2f9e'; ctx.fillText(name,tx,ty+Math.round(h*.8));
  if(d===selected){ const a=Math.floor(perf*3)%2; ctx.save(); ctx.translate(Math.round(X)-2*f,ty-9*f-a*f); ctx.scale(f,f); heart(0,0,'#ff4f9a'); ctx.restore(); }
  let text=null; if(d.emo) text=d.emo; else if(i===bubbleIdx&&d.state==='work'){ if(bubbleKind==='role') text=d.b.bubble;
    else { const th=thoughtText(d,bubbleKind); if(th){ thoughtBubble(X,ty,th); ctx.font=fs+'px Silk'; ctx.textAlign='left'; return; } text=d.b.bubble; } }
  if(text){ const tw=ctx.measureText(text).width+12*f, bh=Math.round(15*f), bx=Math.max(4,Math.min(OW-tw-4,Math.round(X-tw/2))), by=Math.round(ty-bh-8*f);
    roundRect(bx+.5,by+.5,Math.round(tw),bh,6*f,'#ffffff','#ff6fb5');
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(X-3*f,by+bh); ctx.lineTo(X+3*f,by+bh); ctx.lineTo(X,by+bh+5*f); ctx.fill();
    ctx.strokeStyle='#ff6fb5'; ctx.beginPath(); ctx.moveTo(X-3*f,by+bh+.5); ctx.lineTo(X,by+bh+5*f); ctx.lineTo(X+3*f,by+bh+.5); ctx.stroke();
    ctx.fillStyle='#7a2f9e'; ctx.fillText(text,bx+tw/2,by+Math.round(bh*.7)); }
  ctx.textAlign='left';
}
const bursts=[]; function burst(x,y){ bursts.push({x,y,t:0}); }
let perf=0, last=performance.now();
function scene(dt){
  drawRoom(perf);
  for(const b of bursts){ b.t+=dt; const r=4+b.t*20; ctx.strokeStyle='rgba(255,79,168,'+Math.max(0,1-b.t*1.5)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(b.x,b.y,r,r/3,0,0,7); ctx.stroke(); }
  while(bursts.length&&bursts[0].t>0.7) bursts.shift();
  const items=[...PROPS.filter(p=>!(PORTRAIT&&p.hideP)).map(p=>({base:p.base,draw:()=>{ if(PORTRAIT&&p.altP){ const a=IMG[p.altP]; ctx.drawImage(a,p.x+p.w/2-a.width*1.5,p.base-a.height*3,a.width*3,a.height*3); } else ctx.drawImage(IMG[p.k],p.x,p.y,p.w,p.h); }})),...CUSTOM,...dolls.map(d=>({base:d.y+0.5,draw:()=>drawDoll(d)})),...(READY?visItems():[])];
  items.sort((a,b)=>a.base-b.base).forEach(o=>o.draw());
  ctx.font='8px Silk'; ctx.textAlign='center';
  DESKS.forEach((dk,i)=>{ const b=BOTS.find(b=>b.desk===i); if(!b) return; const w=ctx.measureText(b.plate).width+8;
    roundRect(dk.x+48-w/2,dk.y+44,w,10,3,'#ffd6f0','#c23c80'); ctx.fillStyle='#a02a6a'; ctx.fillText(b.plate,dk.x+48,dk.y+52); });
  ctx.textAlign='left';
  for(const s of SPARK){ const k=(perf+s.p)%6; if(k<1.2) sparkle(Math.round(s.x),Math.round(s.y),k<.6?1:2,k<.4?'#ffffff':'#fff6a8'); }
  if(NIGHT) drawNight();
  drawBall(perf); drawPoofs(dt); drawNotes(dt); if(READY){ drawEggs(dt); drawRelCues(dt); drawGenie(); }
  if(!PHONE){ dolls.forEach((d,i)=>drawLabels(d,i)); if(READY){ drawVisLabels(); drawGenieLabel(); } drawFloats(dt); }
}
function drawOverlay(dt){
  for(let k=1;k<ZONES.length;k++){ const y=ZONES[k].dy; px(0,y-2,OW,4,'#ffffff'); px(0,y-1,OW,2,'#c9a8ff'); }
  const order=dolls.map((d,i)=>[d,i]).sort((a,b)=>a[0].y-b[0].y);
  for(const [d,i] of order){ const o=toOut(d.x,d.y); drawLabels(d,i,o.x,o.y); }
  if(READY){ drawVisLabels(); drawGenieLabel(); }
  drawFloats(dt);
}
let paused=false;
document.addEventListener('visibilitychange',()=>{ if(document.hidden){ paused=true; } else if(paused){ paused=false; last=performance.now(); requestAnimationFrame(render); } });
function render(now){
  if(paused) return;
  const dt=Math.min(.05,(now-last)/1000); last=now; perf+=dt;
  update(dt);
  if(PHONE){ ctx=offCtx; ctx.setTransform(S,0,0,S,0,0); ctx.imageSmoothingEnabled=false; scene(dt);
    ctx=mainCtx; ctx.setTransform(1,0,0,1,0,0); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.clearRect(0,0,cv.width,cv.height);
    for(const z of ZONES){ const y0=Math.round(z.dy*Z), y1=Math.round((z.dy+z.h)*Z); ctx.drawImage(off,z.sx*S,z.sy*S,z.w*S,z.h*S,Math.round(z.dx*Z),y0,Math.round(z.w*Z),y1-y0); }
    ctx.setTransform(Z,0,0,Z,0,0); drawOverlay(dt); }
  else if(SUPER){ ctx=offCtx; ctx.setTransform(S,0,0,S,0,0); ctx.imageSmoothingEnabled=false; scene(dt);
    ctx=mainCtx; ctx.setTransform(1,0,0,1,0,0); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.clearRect(0,0,cv.width,cv.height); ctx.drawImage(off,0,0,cv.width,cv.height); }
  else { ctx=mainCtx; ctx.setTransform(Z,0,0,Z,0,0); ctx.imageSmoothingEnabled=false; scene(dt); }
  if(cardDoll) drawPortrait(); drawDressPreview();
  requestAnimationFrame(render);
}
