const ASSETS = __ASSETS__;
const BOTS = __BOTS__;
const SHARE = __SHARE__;
const WW = 1056, WH = 624, T = 32, DW = 36, DH = 96, FEET = 92;
const cv = document.getElementById('c'); let ctx = cv.getContext('2d');
const mainCtx = ctx;
const wrap = document.getElementById('wrap'), card = document.getElementById('card'), tip = document.getElementById('tip');
let K = 1, Z = 1, S = 1, SUPER = false;
// phone modes: PHONE = small/touch screen (full-bleed, page scrolls, big overlay labels); PORTRAIT = room re-stacked into 4 zones
let PHONE = false, PORTRAIT = false, ZONES = [], OW = WW, OH = WH, LF = 1;
const off = document.createElement('canvas'), offCtx = off.getContext('2d');
function computeZones(){
  if (PORTRAIT) { ZONES = [{sx:0,sy:0,w:528,h:416},{sx:528,sy:88,w:528,h:256},{sx:528,sy:344,w:528,h:280},{sx:0,sy:416,w:528,h:208}];
    let y = 0; ZONES.forEach(z=>{ z.dx = 0; z.dy = y; y += z.h; }); OW = 528; OH = y; }
  else { ZONES = [{sx:0,sy:0,w:WW,h:WH,dx:0,dy:0}]; OW = WW; OH = WH; }
}
function toOut(x,y){ let best=null, bd=1e9;
  for (const z of ZONES){ const cx=Math.max(z.sx,Math.min(z.sx+z.w-1,x)), cy=Math.max(z.sy,Math.min(z.sy+z.h-1,y)), dd=Math.hypot(cx-x,cy-y);
    if (dd<bd){ bd=dd; best={x:x-z.sx+z.dx,y:y-z.sy+z.dy}; } } return best; }
function zoneOf(x,y){ for(let k=0;k<ZONES.length;k++){ const z=ZONES[k]; if(x>=z.sx&&x<z.sx+z.w&&y>=z.sy&&y<z.sy+z.h) return k; } return -1; }
function toWorld(x,y){ for (const z of ZONES) if (x>=z.dx&&x<z.dx+z.w&&y>=z.dy&&y<z.dy+z.h) return {x:x-z.dx+z.sx,y:y-z.dy+z.sy}; return {x:-99,y:-99}; }
function fit(){
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const coarse = matchMedia('(pointer: coarse)').matches;
  PHONE = Math.min(vw, vh) <= 520 || (coarse && Math.max(vw, vh) <= 950);
  PORTRAIT = PHONE && vh > vw;
  document.body.classList.toggle('phone', PHONE); document.documentElement.classList.toggle('phone', PHONE); document.body.classList.toggle('portrait', PORTRAIT);
  computeZones();
  if (PHONE) {
    K = vw / OW; const dpr = Math.min(2, window.devicePixelRatio || 1); Z = K * dpr; SUPER = true;
    S = Math.min(2, Math.max(1, Math.ceil(Z - 0.02))); LF = Math.max(1, 1.5 / K);
    cv.style.width = vw + 'px'; cv.style.height = Math.round(OH*K) + 'px';
    cv.width = Math.round(OW*Z); cv.height = Math.round(OH*Z); off.width = WW*S; off.height = WH*S;
    card.style.maxHeight = ''; return;
  }
  LF = 1;
  const hdr = document.querySelector('header').offsetHeight;
  const H = innerHeight - hdr - 18, W = vw - 22;
  K = Math.max(0.3, Math.min(H / WH, W / WW));
  const dpr = window.devicePixelRatio || 1; Z = K * dpr;
  SUPER = Math.abs(Z - Math.round(Z)) > 0.02 || Z < 1; S = Math.max(1, Math.ceil(Z - 0.02));
  cv.style.width = Math.round(WW*K)+'px'; cv.style.height = Math.round(WH*K)+'px';
  cv.width = Math.round(WW*Z); cv.height = Math.round(WH*Z);
  if (SUPER) { off.width = WW*S; off.height = WH*S; } else Z = Math.round(Z);
  card.style.maxHeight = Math.round(WH*K - 20) + 'px';
}
fit(); addEventListener('resize', fit);
const IMG = {};
function load(){ return Promise.all(Object.entries(ASSETS).map(([k,u])=>new Promise(r=>{const i=new Image();i.onload=()=>{IMG[k]=i;r();};i.src=u;}))); }

// ---------- layout (wide room: desks | boba + lounge | dressing room  /  sushi | dance | chill corner)
const DESKS = [{x:40,y:136},{x:192,y:136},{x:344,y:136},{x:40,y:262},{x:192,y:262},{x:344,y:262}];
const PROPS = [], CUSTOM = [], BLOCK = [];
function prop(k,x,y,base,o){ const i=IMG[k]; PROPS.push({k,x,y,w:i.width*2,h:i.height*2,base:base??(y+i.height*2),...(o||{})}); }
function block(x0,y0,x1,y1){ BLOCK.push([x0,y0,x1,y1]); }
function buildLayout(){
  DESKS.forEach(d=>{ prop('desk',d.x,d.y); prop('pcback',d.x+8,d.y-12,d.y+57); block(d.x-2,d.y+62,d.x+98,d.y+70); });
  prop('pot',DESKS[0].x+70,DESKS[0].y+4,DESKS[0].y+57);
  prop('coffee',DESKS[1].x+66,DESKS[1].y+18,DESKS[1].y+57);
  prop('cactus',DESKS[2].x+72,DESKS[2].y-26,DESKS[2].y+57);
  prop('coffee',DESKS[3].x+66,DESKS[3].y+18,DESKS[3].y+57);
  prop('pot',DESKS[4].x+70,DESKS[4].y+4,DESKS[4].y+57);
  prop('plant2',DESKS[5].x+72,DESKS[5].y-26,DESKS[5].y+57);
  // big plants (decor)
  prop('lplant',452,236); block(456,300,512,332);
  prop('lplant',752,224,undefined,{hideP:true}); block(756,288,812,320);
  prop('lplant',984,356,undefined,{altP:'plant2'}); block(988,420,1044,452);
  // lounge sofa on its rug (under the boba bar)
  CUSTOM.push({base:298,draw:drawSofa}); block(578,280,706,302);
  addBoba(); addDressing(); addFun();
}
const POI = {
  boba:{x:632,y:204,emo:'🧋 boba run!'},
  window:{x:380,y:122,emo:'✧ window daydream ✧'},
  board:{x:228,y:122,emo:'✎ updating the whiteboard'},
  sofa:{x:640,y:316,emo:'♡ quick sofa break'},
  jam:{x:920,y:560,emo:'🎧 vibing to the music'},
};
// ---------- grid pathfinding (16px cells)
const C=16, GW=WW/C, GH=WH/C; let grid;
function buildGrid(){ grid=new Uint8Array(GW*GH);
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){ const x=gx*C+8,y=gy*C+8; let b=y<112||x<12||x>WW-12||y>WH-8;
    for(const [x0,y0,x1,y1] of BLOCK) if(x>=x0&&x<x1&&y>=y0&&y<y1) b=true; grid[gy*GW+gx]=b?1:0; } }
const cell=(x,y)=>[Math.max(0,Math.min(GW-1,Math.floor(x/C))),Math.max(0,Math.min(GH-1,Math.floor(y/C)))];
const free=(gx,gy)=>gx>=0&&gy>=0&&gx<GW&&gy<GH&&!grid[gy*GW+gx];
function path(ax,ay,bx,by){
  let [sx,sy]=cell(ax,ay),[tx,ty]=cell(bx,by);
  if(!free(tx,ty)){ let best=null,bd=1e9; for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){ if(free(tx+dx,ty+dy)){ const dd=dx*dx+dy*dy; if(dd<bd){bd=dd;best=[tx+dx,ty+dy];} } } if(!best||bd>2) return null; [tx,ty]=best; }
  const prev=new Int32Array(GW*GH).fill(-1), q=[sy*GW+sx]; prev[sy*GW+sx]=sy*GW+sx;
  const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(let qi=0;qi<q.length;qi++){ const cur=q[qi],cx=cur%GW,cy=(cur/GW)|0; if(cx===tx&&cy===ty) break;
    for(const [dx,dy] of dirs){ const nx=cx+dx,ny=cy+dy; if(!free(nx,ny)) continue; if(dx&&dy&&(!free(cx+dx,cy)||!free(cx,cy+dy))) continue;
      const n=ny*GW+nx; if(prev[n]!==-1) continue; prev[n]=cur; q.push(n); } }
  const end=ty*GW+tx; if(prev[end]===-1) return null;
  const pts=[]; let c=end; while(c!==sy*GW+sx){ pts.push({x:(c%GW)*C+8,y:((c/GW)|0)*C+8}); c=prev[c]; }
  pts.reverse(); const [ex,ey]=cell(bx,by); if(ex===tx&&ey===ty&&pts.length) pts[pts.length-1]={x:bx,y:by}; else pts.push({x:bx,y:by}); return pts;
}
// ---------- looks (persisted)
const LS_KEY='girlieOffice.looks.v1';
let SAVED={}; try{ SAVED=JSON.parse(localStorage.getItem(LS_KEY)||'{}')||{}; }catch(e){ SAVED={}; }
function persist(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(SAVED)); }catch(e){} }
const clone=o=>JSON.parse(JSON.stringify(o));
function lookFor(key){ return clone(SAVED[key]||DEFAULT_LOOKS[key]||DEFAULT_LOOKS.cos); }
// ---------- dolls
const FR={idle:0,stepA:1,stepB:2,typeA:3,typeB:4};
const dolls=[];
function seat(i){ const d=DESKS[i]; return {x:d.x+58,y:d.y+58}; }
function silhouette(src,color){ const g=document.createElement('canvas'); g.width=src.width; g.height=src.height; const gc=g.getContext('2d'); gc.drawImage(src,0,0); gc.globalCompositeOperation='source-in'; gc.fillStyle=color; gc.fillRect(0,0,g.width,g.height); return g; }
function setLook(d,look){ d.look=look; d.img=buildDollSheet(d.b.key,look); d.glow=silhouette(d.img,'#fff6a8'); d.glow2=silhouette(d.img,'#ff4fa8'); }
function initDolls(){
  BOTS.forEach((b,i)=>{ const s=seat(b.desk);
    const d={b,x:s.x,y:s.y,home:s,state:'work',path:[],t:Math.random()*10,next:8+Math.random()*20+i*5,awayT:0,emo:null,stay:0,partner:null};
    setLook(d,lookFor(b.key)); dolls.push(d); });
}
function goTo(d,x,y,state,emo,_u,mode){
  const p=path(d.x,d.y,x,y); if(!p) return false;
  if(d.seat&&mode!=='eat'){ d.seat.who=null; d.seat=null; }
  d.path=p; d.state='walk'; d.after=state; d.afterEmo=emo; d.afterMode=mode||null; d.mode=null; d.emo=null; return true;
}
function warpHome(d){ poof(d.x,d.y-40); if(d.seat){ d.seat.who=null; d.seat=null; }
  d.x=d.home.x; d.y=d.home.y; d.path=[]; d.state='work'; d.mode=null; d.emo=null; d.partner=null; d.awayT=0; d.next=20+Math.random()*25; d.zone=undefined; poof(d.x,d.y-40); }
function goHome(d,now){ d.partner=null;
  if(d.state==='work'&&Math.hypot(d.x-d.home.x,d.y-d.home.y)<2) return;
  const p=path(d.x,d.y,d.home.x,d.home.y);
  if(!p||(now&&p.length>12)){ warpHome(d); return; }
  goTo(d,d.home.x,d.home.y,'work'); }
function wander(d){
  const r=Math.random(), dance=musicOn()?0.2:0;
  if(r<0.18){ const o=pickPartner(d);
    if(o){ const side=o.home.x<150?34:-34; const l=chatLines(d,o);
      if(goTo(d,o.home.x+side,o.home.y+2,'chat',l[0])){ d.partner=o; d.reply=l[1]; return; } } }
  if(r<0.36+dance){ const [x,y]=danceSpot((Math.random()*6)|0); if(goTo(d,x,y,'poi','♪ dancing!',null,'dance')) return; }
  if(r<0.52+dance){ const s=freeSeat(); if(s&&goTo(d,s.x,s.y,'poi','🍣 sushi break!',null,'eat')){ s.who=d; d.seat=s; return; } }
  if(r<0.70+dance){ if(goTo(d,BOOTH.door.x,BOOTH.door.y,'enterBooth',null)) return; }
  const opts=Object.keys(POI), k=opts[(Math.random()*opts.length)|0], p=POI[k];
  goTo(d,p.x+((Math.random()*12-6)|0),p.y,'poi',p.emo);
}
let partyT=0;
let selected=null, hover=null, bubbleIdx=-1, bubbleClock=1.2;
function update(dt){
  if(party){ partyT-=dt; if(partyT<=0) toParty(false); }
  for(const d of dolls){
    d.t+=dt;
    if(d.state!=='work'&&d.state!=='party'){ d.awayT=(d.awayT||0)+dt; if(d.awayT>30&&d.stay<1e8) warpHome(d); } else if(d.state==='work') d.awayT=0;
    if(d.state==='walk'){
      let move=84*dt;
      while(move>0&&d.path.length){ const p=d.path[0],dx=p.x-d.x,dy=p.y-d.y,dist=Math.hypot(dx,dy);
        if(dist<=move){ d.x=p.x; d.y=p.y; d.path.shift(); move-=dist; } else { d.x+=dx/dist*move; d.y+=dy/dist*move; move=0; } }
      if(PORTRAIT){ const zk=zoneOf(d.x,d.y); if(zk>=0){ if(d.zone!==undefined&&zk!==d.zone){ poof(d.x,d.y-40); poof(d.x,d.y-60); } d.zone=zk; } }
      if(!d.path.length){
        d.state=d.after; d.mode=d.afterMode||null; d.emo=d.afterEmo||null;
        d.stay=d.state==='work'?0:(d.state==='sent'?8:d.state==='chat'?3+Math.random()*3:4+Math.random()*4);
        if(d.state==='work'){ d.next=22+Math.random()*28; d.awayT=0; }
        if(d.state==='chat'&&d.partner){ d.partner.emo=d.reply||'omg hiii'; d.partner.emoT=4; }
        if(d.state==='enterBooth'){ d.state='changing'; d.stay=2.6; poof(BOOTH.cx,BOOTH.y0+50); }
      }
    } else if(d.state==='work'){
      d.next-=dt;
      if(d.next<=0&&!party&&dolls.filter(o=>o.state!=='work').length<1&&d!==selected) wander(d); else if(d.next<=0) d.next=4+Math.random()*6;
    } else if(d.state==='party'){ /* dance until party mode ends */ }
    else if(d.state==='changing'){
      d.stay-=dt; curtainSway=1;
      if(d.stay<=0){ const restyled=autoRestyle(d); poof(BOOTH.cx,BOOTH.y0+50); d.state='poi'; d.mode=null; d.stay=3.5; d.emo=restyled?'✨ new look!':'💄 touched up my gloss'; }
    } else { d.stay-=dt; if(d.stay<=0) goHome(d); }
    if(d.emoT!==undefined){ d.emoT-=dt; if(d.emoT<=0){ d.emoT=undefined; if(d.state==='work') d.emo=null; } }
  }
  bubbleClock-=dt; if(bubbleClock<=0){ bubbleIdx=(bubbleIdx+1)%dolls.length; bubbleKind=pickBubbleKind(dolls[bubbleIdx]); bubbleClock=bubbleKind==='role'?4.5:6.5; }
  if(READY){ updateAxo(dt); updateEggs(dt); tickArc(dt); updateGenie(dt); }
}
function frameOf(d){
  if(d.state==='walk') return (Math.floor(d.t*6)%2)?FR.stepA:FR.stepB;
  if(d.mode==='dance'){ const sp=musicOn()?beatRate()*2:(party?5:4); return (Math.floor(d.t*sp)%2)?FR.stepA:FR.stepB; }
  if(d.mode==='eat') return (Math.floor(d.t*1.5)%2)?FR.typeA:FR.typeB;
  if(d.state==='work'){ const ph=d.t%7; if(ph>5.6) return FR.idle; return (Math.floor(d.t*4)%2)?FR.typeA:FR.typeB; }
  return FR.idle;
}
function bob(d){
  if(d.mode==='dance'){ if(musicOn()) return beatPhase()<.35?-3:0; return (Math.floor(d.t*(party?5:4))%2)?-3:0; }
  if(d.state==='walk') return (Math.floor(d.t*6)%2)?-1:0; if(d.state==='work') return 0; return (Math.floor(d.t*1.6)%2)?1:0;
}
