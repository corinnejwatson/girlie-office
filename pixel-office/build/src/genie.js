// ---------- GENIE egg: tap the little bottle on the boba bar. A generic dollz genie labeled with the owner name swirls out,
// says one short original line, grants a tiny effect (sparkle or a doll twirl) and goes back in (~4.6s). Not a likeness.
const BOTTLE={x:695,y:100,w:15,h:21};
const GENIE={on:false,t:0,line:'',done:false,img:null};
const GENIE_LINES=['your wish is my pipeline','three wishes: pipeline, pipeline, pipeline','poof! one sparkle, on the house','wish granted. back to my bottle!','i grant wishes and tidy CRMs'];
const GSMOKE=[];
function buildGenie(){
  const look={hair:'lavender',hairStyle:'pony',top:'halter',topColor:'#ff6fb5',print:'none',bottom:'flares',bottomColor:'#b07ad8',shoe:'#ff9ad5',hat:'none',acc:['tiara','hoops'],item:null};
  const px_=renderDollFrame('cos',look,'idle',false), c=document.createElement('canvas'); c.width=DOLL_W; c.height=DOLL_H;
  const g=c.getContext('2d'), id=g.createImageData(DOLL_W,DOLL_H), WAIST=50;
  for(const [k,v] of px_){ const x=k%64,y=(k/64)|0; if(y>WAIST||x>=DOLL_W) continue; const i=(y*DOLL_W+x)*4; id.data[i]=v[0];id.data[i+1]=v[1];id.data[i+2]=v[2];id.data[i+3]=255; }
  g.putImageData(id,0,0);
  // wispy smoke tail instead of legs, curling toward the bottle
  const cols=['#e8dcff','#c9a8ff','#b07ad8'];
  for(let y=WAIST+1;y<DOLL_H-6;y++){ const p=(y-WAIST)/(DOLL_H-6-WAIST), w=Math.max(1,Math.round(9*(1-p))), cx=CXD+Math.round(Math.sin(p*5)*4*p);
    for(let x=cx-w;x<=cx+w;x++){ g.fillStyle=cols[(x===cx-w||x===cx+w)?2:((x+y)%5===0?0:1)]; g.fillRect(x,y,1,1); } }
  return c; }
function drawBottle(){ const {x,y}=BOTTLE, gl=GENIE.on?0:(Math.floor(perf*1.2)%7===0);
  px(x+5,y,5,2,'#a0603a'); px(x+4,y+2,7,3,'#e8dcff'); px(x+5,y+2,1,3,'#ffffff');
  px(x+1,y+5,13,15,'#c9a8ff'); px(x,y+8,15,10,'#c9a8ff'); px(x+2,y+6,4,10,'#e8dcff'); px(x+3,y+11,2,3,'#ffffff');
  px(x+9,y+9,4,7,'#ff6fb5'); px(x+1,y+19,13,2,'#8a5ab8'); px(x,y+17,15,1,'#b07ad8');
  if(gl) sparkle(x+12,y+4,1,'#ffffff'); }
function genieTap(p){ const pad=PHONE?10:4;
  if(p.x<BOTTLE.x-pad||p.x>BOTTLE.x+BOTTLE.w+pad||p.y<BOTTLE.y-pad||p.y>BOTTLE.y+BOTTLE.h+pad) return false;
  if(GENIE.on) return true; if(!GENIE.img) GENIE.img=buildGenie();
  let l; do{ l=GENIE_LINES[(Math.random()*GENIE_LINES.length)|0]; }while(l===GENIE.line);
  Object.assign(GENIE,{on:true,t:0,line:l,done:false}); puffAt(BOTTLE.x+7,BOTTLE.y,10); sfx('genie'); return true; }
function puffAt(x,y,n){ for(let i=0;i<n;i++) GSMOKE.push({x:x+(Math.random()-.5)*10,y,vx:(Math.random()-.5)*24,vy:-14-Math.random()*20,t:0,life:.7+Math.random()*.4}); }
function updateGenie(dt){
  for(const s of GSMOKE){ s.t+=dt; s.x+=s.vx*dt; s.y+=s.vy*dt; } for(let i=GSMOKE.length-1;i>=0;i--) if(GSMOKE[i].t>GSMOKE[i].life) GSMOKE.splice(i,1);
  for(const d of dolls){ if(d.twirl>0) d.twirl-=dt; }
  if(!GENIE.on) return; GENIE.t+=dt;
  if(!GENIE.done&&GENIE.t>1.5){ GENIE.done=true; const atDesk=dolls.filter(d=>d.state==='work'), d=atDesk.length?atDesk[(Math.random()*atDesk.length)|0]:dolls[0];
    if(Math.random()<.5){ d.twirl=.9; sfx('spin'); } else { for(let i=0;i<5;i++) FLOATS.push({x:d.x+(Math.random()-.5)*26,y:d.y-FEET-6-Math.random()*18,text:'✧',t:1+Math.random()*.5}); sfx('pop'); } }
  if(GENIE.t>4.0&&GENIE.t-dt<=4.0) puffAt(BOTTLE.x+7,BOTTLE.y,8);
  if(GENIE.t>4.6) GENIE.on=false; }
function genieScale(){ const t=GENIE.t; return t<.7?t/.7:t>4.0?Math.max(0,(4.6-t)/.6):1; }
// she swirls out of the bottle mouth to float just in front of the counter (keeps her inside the boba section on phones)
function genieAnchor(){ const s=genieScale(), bx=BOTTLE.x+7, by=BOTTLE.y+2, ax=BOTTLE.x+40, ay=BOTTLE.y+84;
  const bob=GENIE.t>.7&&GENIE.t<4?Math.sin(perf*2.4)*2:0; return {x:bx+(ax-bx)*s, y:by+(ay-by)*s+bob, s}; }
function drawGenie(){
  for(const sm of GSMOKE){ ctx.globalAlpha=Math.max(0,1-sm.t/sm.life)*.85; const r=2+Math.round(sm.t*6); px(Math.round(sm.x-r/2),Math.round(sm.y-r/2),r,r,'#e8dcff'); }
  ctx.globalAlpha=1; if(!GENIE.on) return;
  const a=genieAnchor(), w=DOLL_W*a.s, h=DOLL_H*a.s, sway=Math.sin(GENIE.t*6)*3*(1-Math.min(1,GENIE.t/.9))+Math.sin(perf*1.6)*1.5;
  // thin wisp linking her tail back to the bottle
  ctx.globalAlpha=.55; for(let i=1;i<6;i++){ const k=i/6, x=BOTTLE.x+7+(a.x-BOTTLE.x-7)*k+Math.sin(perf*3+i)*2, y=BOTTLE.y+(a.y-6-BOTTLE.y)*k; px(Math.round(x)-1,Math.round(y)-1,3,3,'#e8dcff'); }
  ctx.globalAlpha=Math.min(1,a.s*1.4); ctx.drawImage(GENIE.img,Math.round(a.x-w/2+sway),Math.round(a.y-h),Math.round(w),Math.round(h)); ctx.globalAlpha=1; }
function drawGenieLabel(){ if(!GENIE.on||GENIE.t<.6||GENIE.t>4.1) return; const P=(x,y)=>PHONE?toOut(x,y):{x,y};
  const a=genieAnchor(), o=P(a.x,a.y-DOLL_H+4), ty=namePlate(o.x,o.y,OFFICE.owner.toUpperCase(),'#b07ad8'); speechBubble(o.x,ty-2*LF,GENIE.line,null,'#b07ad8'); }
