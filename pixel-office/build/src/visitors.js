// ---------- MOCHI the axolotl (original pixel art) + shared speech-bubble helpers
// READY flips on at boot; eggs, Mochi and genie only run once the room is built.
let READY=false;
// Mochi the axolotl: genuine, widely-attributed philosopher quotes (sources in quotes-sources.md)
const AXQ=[
  ['The unexamined life is not worth living.','Socrates'],['I think, therefore I am.','René Descartes'],
  ['Man is born free, and everywhere he is in chains.','Jean-Jacques Rousseau'],['What does not kill me makes me stronger.','Friedrich Nietzsche'],
  ['Man is by nature a political animal.','Aristotle'],['Hell is other people.','Jean-Paul Sartre'],
  ['You cannot step into the same river twice.','Heraclitus'],['Whereof one cannot speak, thereof one must be silent.','Ludwig Wittgenstein'],
  ['Life can only be understood backwards; but it must be lived forwards.','Søren Kierkegaard'],['Leisure is the mother of philosophy.','Thomas Hobbes'],
  ['One is not born, but rather becomes, a woman.','Simone de Beauvoir'],['Knowledge itself is power.','Francis Bacon'],
  ['To be is to be perceived.','George Berkeley'],['Man is the measure of all things.','Protagoras'],
  ['Very little is needed to make a happy life.','Marcus Aurelius'],['Waste no more time arguing what a good man should be. Be one.','Marcus Aurelius'],
  ['A journey of a thousand miles begins with a single step.','Laozi'],['To know what you know and what you do not know, that is true knowledge.','Confucius'],
  ['The heart has its reasons which reason knows nothing of.','Blaise Pascal'],['The owl of Minerva spreads its wings only with the falling of the dusk.','G.W.F. Hegel'],
];
// ----- Mochi the axolotl (original pixel art): roams open floor squares in the lounge / dance / chill half, never blocks anything
const AXO_MAP=["G.................G..","gG...ooooooooo...Gg..",".gg.obbbbbbbbbo.gg...","Gg.obbbbbbbbbbbo.gG..",".ggobbwebbbewbbogg...","Gg.obbeebbbeebbo.gG..",
  ".g.ocbbbmbmbbbco.g...","...obbbbbmbbbbbo.oo..","....obbbbbbbbbooobbo.",".....olllllllo.lbbbo.","......obooobo..ooo..."];
const AXO_C={o:'#e0709f',b:'#ffb3d1',l:'#ffd6e6',g:'#ff5fa2',G:'#ffa0cd',e:'#28142a',w:'#ffffff',c:'#ff82af',m:'#a03264'};
const AXO={x:760,y:600,path:[],t:0,dir:1,wait:3,bub:null,say:14,tapT:0};
const AXO_AREA={x0:548,y0:312,x1:1040,y1:612};
function axoRoam(){
  for(let n=0;n<40;n++){ const x=AXO_AREA.x0+Math.random()*(AXO_AREA.x1-AXO_AREA.x0), y=AXO_AREA.y0+Math.random()*(AXO_AREA.y1-AXO_AREA.y0), [gx,gy]=cell(x,y);
    if(!free(gx,gy)) continue; const tx=gx*C+8, ty=gy*C+8; if(Math.hypot(tx-AXO.x,ty-AXO.y)>220) continue;
    const p=path(AXO.x,AXO.y,tx,ty); if(p&&p.length<30){ AXO.path=p; return; } }
  AXO.wait=2;
}
function axoSay(){ VARC.wisdom=(VARC.wisdom||0)+1; const q=AXQ[(Math.random()*AXQ.length)|0]; AXO.bub={text:q[0],by:'— '+q[1],T:Math.min(7,3.8+q[0].length*0.04)}; }
function updateAxo(dt){
  AXO.t+=dt; if(AXO.tapT>0) AXO.tapT-=dt; if(AXO.bub){ AXO.bub.T-=dt; if(AXO.bub.T<=0) AXO.bub=null; }
  if(AXO.path.length&&!AXO.bub){ let move=13*dt; while(move>0&&AXO.path.length){ const p=AXO.path[0],dx=p.x-AXO.x,dy=p.y-AXO.y,dist=Math.hypot(dx,dy); if(Math.abs(dx)>.5) AXO.dir=dx>0?1:-1;
      if(dist<=move){ AXO.x=p.x; AXO.y=p.y; AXO.path.shift(); move-=dist; } else { AXO.x+=dx/dist*move; AXO.y+=dy/dist*move; move=0; } }
    if(!AXO.path.length) AXO.wait=4+Math.random()*7; }
  else if(!AXO.path.length){ AXO.wait-=dt; if(AXO.wait<=0) axoRoam(); }
  AXO.say-=dt; if(AXO.say<=0){ AXO.say=24+Math.random()*16; if(!AXO.bub) axoSay(); }
}
function drawAxo(){
  const s=1.5, w=21, h=AXO_MAP.length, walking=AXO.path.length>0&&!AXO.bub, bobY=walking&&(Math.floor(AXO.t*4)%2)?-s:0;
  ctx.fillStyle='rgba(120,70,160,.22)'; ctx.beginPath(); ctx.ellipse(AXO.x,AXO.y+1,13,3,0,0,7); ctx.fill();
  ctx.save(); ctx.translate(Math.round(AXO.x),Math.round(AXO.y-h*s+bobY)); ctx.scale(AXO.dir*s*(AXO.spin>0?Math.cos((1.1-AXO.spin)/1.1*Math.PI*4):1),s); ctx.translate(-w/2,0);
  const flutter=Math.floor(AXO.t*(AXO.bub?6:2))%2;
  if(AXO===hoverV){ ctx.fillStyle='#fff6a8'; AXO_MAP.forEach((r,y)=>{ for(let x=0;x<r.length;x++) if(r[x]!=='.') ctx.fillRect(x-1,y-1,3,3); }); }
  AXO_MAP.forEach((r,y)=>{ for(let x=0;x<r.length;x++){ let ch=r[x]; if(ch==='.') continue; if(flutter&&(ch==='G'||ch==='g')) ch=ch==='G'?'g':'G';
    if(walking&&y===h-1&&(Math.floor(AXO.t*4)%2)&&ch==='b') ch='o'; ctx.fillStyle=AXO_C[ch]; ctx.fillRect(x,y,1,1); } });
  ctx.restore();
}
function visItems(){ return [{base:AXO.y+0.3,draw:drawAxo}]; }
function initMochi(){ AXO.x=760; AXO.y=600; AXO.wait=2; READY=true; }
// ----- labels + speech bubbles (one per character, auto-hide, clamped inside the canvas)
let hoverV=null;
function wrapLines(text,maxW){ const out=[]; let cur=''; for(const w of text.split(' ')){ const t=cur?cur+' '+w:w; if(!cur||ctx.measureText(t).width<=maxW) cur=t; else { out.push(cur); cur=w; } } if(cur) out.push(cur); return out; }
function speechBubble(X,topY,text,by,col){
  const f=LF, fs=Math.round(8*f), lh=Math.round(11*f), pad=Math.round(6*f), maxW=Math.min(OW-24*f,(PHONE?165:180)*f);
  ctx.font=fs+'px Silk'; const lines=wrapLines(text,maxW); let w=Math.max(...lines.map(l=>ctx.measureText(l).width));
  if(by){ ctx.font=Math.round(7*f)+'px Silk'; w=Math.max(w,ctx.measureText(by).width); }
  const tw=Math.round(w+pad*2), bh=Math.round(lines.length*lh+(by?lh:0)+pad), bx=Math.round(Math.max(4,Math.min(OW-tw-4,X-tw/2)));
  let by0=Math.round(topY-bh-6*f); const clamped=by0<4; if(clamped) by0=4;
  roundRect(bx+.5,by0+.5,tw,bh,6*f,'#ffffff',col); ctx.lineWidth=1;
  if(!clamped){ const tx=Math.max(bx+8*f,Math.min(bx+tw-8*f,X)); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(tx-3*f,by0+bh); ctx.lineTo(tx+3*f,by0+bh); ctx.lineTo(tx,by0+bh+5*f); ctx.fill();
    ctx.strokeStyle=col; ctx.beginPath(); ctx.moveTo(tx-3*f,by0+bh+.5); ctx.lineTo(tx,by0+bh+5*f); ctx.lineTo(tx+3*f,by0+bh+.5); ctx.stroke(); }
  ctx.textAlign='center'; ctx.font=fs+'px Silk'; ctx.fillStyle='#5b2a86'; lines.forEach((l,i)=>ctx.fillText(l,bx+tw/2,by0+pad/2+lh*(i+0.78)));
  if(by){ ctx.font=Math.round(7*f)+'px Silk'; ctx.fillStyle='#c23c80'; ctx.fillText(by,bx+tw/2,by0+pad/2+lh*(lines.length+0.72)); }
  ctx.textAlign='left';
}
function namePlate(X,top,text,col){
  const f=LF, fs=Math.round(8*f), h=Math.round(10*f); ctx.font=fs+'px Silk'; ctx.textAlign='center';
  const w=ctx.measureText(text).width+8*f, tx=Math.round(Math.max(w/2+3,Math.min(OW-w/2-3,X))), ty=Math.round(top-1.5*f-h);
  roundRect(Math.round(tx-w/2)+.5,ty+.5,Math.round(w),h,4*f,'#ffffffee',col); ctx.fillStyle=col; ctx.fillText(text,tx,ty+Math.round(h*.8)); ctx.textAlign='left'; return ty;
}
function drawVisLabels(){
  const P=(x,y)=>PHONE?toOut(x,y):{x,y};
  if(AXO.bub||AXO===hoverV||AXO.tapT>0){ const o=P(AXO.x,AXO.y), ty=namePlate(o.x,Math.round(o.y-18),'MOCHI ♡','#ff4f9a'); if(AXO.bub) speechBubble(o.x,ty-2*LF,AXO.bub.text,AXO.bub.by,'#ff6fb5'); }
}
function hitVisitor(p){ const k=PHONE?1.4:1;
  if(Math.abs(p.x-AXO.x)<17*k&&p.y>AXO.y-20*k&&p.y<AXO.y+5*k) return AXO;
  return null; }
function tapVisitor(v){ if(v===AXO){ AXO.tapT=4; burst(AXO.x,AXO.y); if(!mochiTap()) axoSay(); return; } }
function visTip(v){ if(v===AXO) return '🩷 <b>Mochi</b> the axolotl<br>resident philosopher · quietly mentoring Sienna in the art of noticing things'+(VARC.wisdom?'<br>has shared '+VARC.wisdom+' thought'+(VARC.wisdom>1?'s':'')+' with you':'')+'<br><i style="color:#b07ad8">click for wisdom ♡</i>'; return ''; }
