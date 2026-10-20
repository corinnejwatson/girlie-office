// ===== Original dollz renderer (port of build/dollz.py) — all sprites drawn in code =====
const DOLL_W=36, DOLL_H=96, CXD=18;
const hx=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
const mixc=(a,b,t)=>a.map((v,i)=>Math.floor(v*(1-t)+b[i]*t));
const darkc=(c,f=.55)=>c.map(v=>Math.floor(v*f));
const WHITE=[255,255,255];
function PAL(base,shade,hi,line){const b=hx(base);return {base:b,shade:shade?hx(shade):darkc(b,.78),hi:hi?hx(hi):mixc(b,WHITE,.45),line:line?hx(line):darkc(b,.5)};}
const mxx=x=>2*CXD-1-x;
const hash2=(x,y,s)=>(Math.imul(x,73856093)^Math.imul(y,19349663)^Math.imul(s,83492791))&0xffff;
class DollR{
  constructor(){this.px=new Map();this.layers={};this.over=new Map();this.midriff=false;}
  layer(n,z,p,tex,noline){this.layers[n]={z,pal:p,tex:tex||null,noline:!!noline};}
  put(L,x,y){ if(x<0||y<0||x>=DOLL_W||y>=DOLL_H) return; const k=y*64+x, c=this.px.get(k); if(c===undefined||this.layers[c].z<=this.layers[L].z) this.px.set(k,L); }
  span(L,y,x0,x1,sym){ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++){ this.put(L,x,y); if(sym) this.put(L,mxx(x),y);} }
  hw(L,y0,y1,f){ for(let y=y0;y<=y1;y++){ const h=typeof f==='function'?f(y):f; if(h>0) this.span(L,y,CXD-h,CXD+h-1);} }
  o(x,y,c,sym){ c=typeof c==='string'?hx(c):c; this.over.set(y*64+x,c); if(sym) this.over.set(y*64+mxx(x),c); }
  erase(x,y){ this.px.delete(y*64+x); }
  get(x,y){ return this.px.get(y*64+x); }
  render(){
    const col=new Map(), byrow=new Map();
    for(const [k,L] of this.px){ const x=k%64,y=(k/64)|0, rk=L+'|'+y; if(!byrow.has(rk)) byrow.set(rk,{L,y,xs:[]}); byrow.get(rk).xs.push(x); }
    for(const {L,y,xs} of byrow.values()){
      xs.sort((a,b)=>a-b); const runs=[]; let st=xs[0],pv=xs[0];
      for(let i=1;i<xs.length;i++){ if(xs[i]!==pv+1){runs.push([st,pv]);st=xs[i];} pv=xs[i]; } runs.push([st,pv]);
      const info=this.layers[L], p=info.pal;
      for(const [a,b] of runs){ const n=b-a+1;
        for(let x=a;x<=b;x++){ const t=(x-a+.5)/n; let c=p.base;
          if(n>=2){ if(t>.74) c=p.shade; else if(t>.6&&(x+y)%2===0) c=p.shade; else if(t>.12&&t<.3&&n>=4&&(x+y)%2===0) c=p.hi; }
          if(info.tex){ const r=info.tex(x,y,t,c,p); if(r) c=r; }
          col.set(y*64+x,c); } }
    }
    for(const [k,L] of this.px){ const info=this.layers[L]; if(info.noline) continue; const x=k%64,y=(k/64)|0;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const M=this.px.get((y+dy)*64+x+dx); if(M&&M!==L&&this.layers[M].z<info.z){ col.set(k,info.pal.line); break; } } }
    for(const [k,c] of this.over) col.set(k,c);
    const out=new Map();
    for(let x=0;x<DOLL_W;x++)for(let y=0;y<DOLL_H;y++){ const k=y*64+x; if(col.has(k)) continue; let best=null;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=DOLL_W||ny>=DOLL_H) continue; const c=col.get(ny*64+nx); if(c&&(!best||c[0]+c[1]+c[2]<best[0]+best[1]+best[2])) best=c; }
      if(best) out.set(k,darkc(best,.42)); }
    for(const [k,c] of out) col.set(k,c);
    return col;
  }
}
function glossAt(x,y,t,p){ if((y===6||y===7)&&t>.2&&t<.62) return (y===6&&t>.3&&t<.5)?WHITE:p.hi; if((y===5||y===8)&&t>.25&&t<.55&&(x+y)%2===0) return p.hi; return null; }
function hairTex(seed){ return (x,y,t,c,p)=>{ const g=glossAt(x,y,t,p); if(g) return g; const h=hash2(x,0,seed)%5; if(h===0&&y%3!==0) return p.hi; if(h===1&&y%2===0) return mixc(p.base,p.hi,.5); if(h===3&&t>.45) return p.shade; return c; }; }
function streakTex(seed,streak){ const sc=hx(streak); return (x,y,t,c,p)=>{ const g=glossAt(x,y,t,p); if(g) return g; const h=hash2(x,0,seed)%7; if(h===0) return y%4?sc:mixc(sc,WHITE,.4); if(h===2&&y%3!==0) return p.hi; if(h===4&&t>.4) return p.shade; return c; }; }
const denimTex=(x,y,t,c,p)=>{ if(y>46&&y<74&&t>.28&&t<.5&&(x+y)%2===0) return p.hi; if(hash2(x,y,7)%11===0) return p.shade; return c; };
const sparkleTex=s=>(x,y,t,c,p)=>hash2(x,y,s)%9===0?WHITE:c;

// ---------- body
function dBody(d,skin,frame){
  d.layer('backhair',0,d.hairpal,d.hairtex,true); d.layer('legs',2,skin); d.layer('torso',3,skin); d.layer('neck',3,skin); d.layer('face',4,skin); d.layer('arm',8,skin);
  d.hw('face',9,21,y=>({9:3,10:4,18:4,19:4,20:3,21:2})[y]??5);
  d.span('face',15,CXD-6,CXD-6,true); d.span('face',16,CXD-6,CXD-6,true);
  d.hw('neck',22,24,2);
  d.hw('torso',25,46,y=>y===25?5:y<=28?6:y<=33?5:y<=40?4:5);
  const step={stepA:[2,0],stepB:[0,2]}[frame]||[0,0]; d.step=step;
  for(const [side,lift] of [[0,step[0]],[1,step[1]]]){
    for(const [y0,y1,x0,x1] of [[45,50,CXD-5,CXD-1],[51,57,CXD-4,CXD-1],[58,80,CXD-4,CXD-2],[81,88,CXD-3,CXD-2]])
      for(let y=y0;y<=y1;y++){ const yy=y-(y>62?lift:0); for(let x=x0;x<=x1;x++) d.put('legs',side?mxx(x):x,yy); }
  }
  const typing=frame.startsWith('type'); d.typing=typing;
  for(const side of [0,1]){
    const Pp=(x,y)=>d.put('arm',side?mxx(x):x,y);
    for(let y=25;y<28;y++){Pp(CXD-7,y);Pp(CXD-6,y);}
    if(!typing){ let sw=0; if(frame==='stepA') sw=side?-1:1; if(frame==='stepB') sw=side?1:-1;
      for(let y=27;y<36;y++){Pp(CXD-8,y);Pp(CXD-7,y);}
      for(let y=36;y<46;y++){const o=y>40?sw:0;Pp(CXD-9+o,y);Pp(CXD-8+o,y);}
      for(let y=46;y<50;y++){Pp(CXD-9+sw,y);Pp(CXD-8+sw,y); if(y===47||y===48) Pp(CXD-10+sw,y);}
    } else { const up=((frame==='typeA')===(side===0))?1:0;
      for(let y=27;y<36;y++){Pp(CXD-8,y);Pp(CXD-7,y);}
      for(let x=CXD-8;x<CXD-2;x++){Pp(x,36-up);Pp(x,37-up);} Pp(CXD-3,35-up);Pp(CXD-2,36-up);Pp(CXD-2,37-up); }
  }
}
function dFace(d,f){
  const eye=f.eye||'#5a3a22', lip=f.lip||'#e0607e', lipd=f.lipd||'#a8324f', blush=f.blush||'#f2a0a8', brow=d.hairpal.line;
  for(const x of [CXD-3,CXD-2]) d.o(x,13,brow,true);
  for(const x of [CXD-5,CXD-4,CXD-3,CXD-2]) d.o(x,14,'#2a1410',true);
  d.o(CXD-4,15,'#ffffff',true); d.o(CXD-3,15,eye,true); d.o(CXD-2,15,darkc(hx(eye),.6),true);
  d.o(CXD-3,16,mixc(d.skin.base,d.skin.shade,.7),true); d.o(CXD-4,17,blush,true);
  d.o(CXD,17,d.skin.shade); d.o(CXD-1,18,d.skin.shade);
  d.o(CXD-2,19,lipd); d.o(CXD+1,19,lipd); d.o(CXD-1,19,lip); d.o(CXD,19,lip); d.o(CXD-1,20,'#ffd0dc'); d.o(CXD,20,lip);
  if(d.midriff) d.o(CXD-1,40,d.skin.shade);
}
// ---------- hair
function hairLong(d,wavy,length){
  d.hw('backhair',4,length,y=>{ let b=y>8?7:({4:4,5:5,6:6,7:6,8:7})[y]; if(y>26) b=7+Math.floor((y-26)/6); if(wavy&&y>12) b+=Math.round(Math.sin(y/2.2)); return b; });
  d.layer('fronthair',9,d.hairpal,d.hairtex);
  d.hw('fronthair',4,10,y=>({4:4,5:5})[y]??6);
  d.span('fronthair',11,CXD-6,CXD+1); d.span('fronthair',12,CXD-6,CXD-1); d.span('fronthair',13,CXD-6,CXD-4);
  for(let y=11;y<13;y++) d.span('fronthair',y,CXD+3,CXD+5);
  for(let y=13;y<22;y++){d.put('fronthair',CXD-6,y);d.put('fronthair',mxx(CXD-6),y);}
  for(let y=14;y<20;y++){d.put('fronthair',CXD-5,y);d.put('fronthair',mxx(CXD-5),y);}
  for(let y=20;y<length-4;y++){ const wv=wavy?Math.round(Math.sin(y/2.2)):0; for(const x of [CXD-7+wv,CXD-6+wv,CXD-5+wv]){d.put('fronthair',x,y);d.put('fronthair',mxx(x),y);} }
  for(let y=13;y<22;y++)for(let x=CXD-4;x<CXD+4;x++) if(d.get(x,y)==='fronthair'){d.erase(x,y);d.put('face',x,y);}
}
function hairFlip(d){
  d.hw('backhair',4,27,y=>y<9?({4:4,5:5,6:6,7:6,8:7})[y]:y<24?7:(({24:8,25:9,26:9,27:8})[y]||0));
  d.layer('fronthair',9,d.hairpal,d.hairtex);
  d.hw('fronthair',4,11,y=>({4:4,5:5})[y]??6);
  for(let y=12;y<24;y++) for(const x of [CXD-7,CXD-6]){d.put('fronthair',x,y);d.put('fronthair',mxx(x),y);}
  for(let y=12;y<15;y++){d.put('fronthair',CXD-5,y);d.put('fronthair',mxx(CXD-5),y);}
  for(const x of [CXD-9,CXD-8]){d.put('fronthair',x,24);d.put('fronthair',mxx(x),24);}
  for(const x of [CXD-10,CXD-9]){d.put('fronthair',x,25);d.put('fronthair',mxx(x),25);}
  for(let y=12;y<22;y++)for(let x=CXD-4;x<CXD+4;x++) if(d.get(x,y)==='fronthair'){d.erase(x,y);d.put('face',x,y);}
}
function hairPony(d){ // sleek top + high ponytail falling behind one shoulder
  d.hw('backhair',4,12,y=>({4:4,5:5,6:6,7:6,8:7})[y]??7);
  for(let y=2;y<40;y++){ const w=y<6?3:y<30?2:1, x=CXD+5+Math.round(Math.sin(y/4)); for(let i=0;i<w;i++) d.put('backhair',x+i,y); }
  d.layer('fronthair',9,d.hairpal,d.hairtex);
  d.hw('fronthair',4,10,y=>({4:4,5:5})[y]??6);
  d.span('fronthair',11,CXD-6,CXD-3); d.span('fronthair',11,CXD+2,CXD+5);
  for(let y=12;y<17;y++){d.put('fronthair',CXD-6,y);d.put('fronthair',mxx(CXD-6),y);}
  d.o(CXD+4,4,'#ff6fb5'); d.o(CXD+5,4,'#ff6fb5'); d.o(CXD+4,5,'#c23c80');
}
// ---------- clothes
function flares(d,p,tex,sole){
  d.layer('jeans',6,p,tex); const [la,lb]=d.step, hem=89; d.hw('jeans',42,50,5);
  for(const [side,lift] of [[0,la],[1,lb]]){
    for(let y=51;y<=hem;y++){ let a,b; if(y<=59){a=CXD-5;b=CXD-1;} else if(y<=72){a=CXD-5;b=CXD-2;} else if(y<=80){a=CXD-6;b=CXD-2;} else {a=CXD-7;b=CXD-2;}
      const yy=y-(y>62?lift:0); for(let x=a;x<=b;x++) d.put('jeans',side?mxx(x):x,yy); }
    d.layer('sole',7,PAL(sole)); for(const y of [hem+1,hem+2]) for(let x=CXD-6;x<CXD-1;x++) d.put('sole',side?mxx(x):x,y-lift);
  }
  for(let y=52;y<60;y++) d.o(CXD-1,y,p.shade);
  d.o(CXD-4,45,p.hi,true); d.o(CXD-3,46,p.hi,true);
}
function platforms(d,sole,strap){
  d.layer('sole',7,PAL(sole)); d.layer('strap',7,PAL(strap||sole));
  for(const [side,lift] of [[0,d.step[0]],[1,d.step[1]]]){ const S=x=>side?mxx(x):x;
    for(let x=CXD-4;x<CXD-1;x++) d.put('strap',S(x),86-lift);
    for(let x=CXD-4;x<CXD;x++) d.put('legs',S(x),88-lift);
    for(const y of [89,90]) for(let x=CXD-5;x<CXD;x++) d.put('sole',S(x),y-lift); }
}
function mini(d,p,tex){
  d.layer('skirt',6,p,tex);
  d.hw('skirt',42,55,y=>y<=44?5:y<=48?6:7);
  for(let y=47;y<=55;y+=1) if(y%2) for(const x of [CXD-4,CXD-1,CXD+2]) d.o(x,y,p.shade);
  for(let x=CXD-7;x<CXD+7;x++) d.o(x,55,p.line);
}
function slipdress(d,p,tex){
  d.layer('dress',6,p,tex);
  for(let y=24;y<27;y++){ d.put('dress',CXD-4,y); d.put('dress',mxx(CXD-4),y); }
  d.hw('dress',27,62,y=>y<=33?5:y<=40?4:y<=46?5:y<=52?6:y<=58?7:8);
  for(let x=CXD-8;x<CXD+8;x++) if(x%2) d.o(x,62,p.hi);
  d.o(CXD-1,28,p.hi); d.o(CXD,28,p.hi);
}
function belt(d,p,buckle,studs){
  d.layer('belt',7,p); d.hw('belt',42,43,5);
  for(const yy of [42,43]){ d.o(CXD-1,yy,buckle); d.o(CXD,yy,yy===42?mixc(hx(buckle),WHITE,.5):buckle); }
  d.o(CXD-2,42,buckle); d.o(CXD+1,43,buckle); if(studs) for(const x of [CXD-4,CXD+3]) d.o(x,42,'#ffffff');
}
function babyTee(d,p,tex,sleeves=true){
  d.layer('top',5,p,tex); d.hw('top',25,35,y=>y===25?5:y<=28?6:y<=33?5:4);
  for(const x of [CXD-2,CXD-1,CXD,CXD+1]){ d.erase(x,25); d.put('torso',x,25); }
  d.erase(CXD-1,26); d.erase(CXD,26); d.put('torso',CXD-1,26); d.put('torso',CXD,26);
  if(sleeves){ d.layer('sleeve',9,p,tex); for(let y=25;y<30;y++) for(const x of [CXD-8,CXD-7,CXD-6]){ d.put('sleeve',x,y); d.put('sleeve',mxx(x),y);} }
  d.midriff=true;
}
function corset(d,p,lace){
  d.layer('top',5,p); d.hw('top',29,39,y=>y<=33?5:4); d.span('top',28,CXD-4,CXD-1,true);
  for(let y=25;y<28;y++){ d.put('top',CXD-4,y); d.put('top',mxx(CXD-4),y); }
  for(let y=30;y<39;y++) d.o(y%2?CXD-1:CXD,y,lace||'#ff9ad5');
  for(let y=30;y<39;y+=2) d.o(CXD-3,y,p.hi,true); d.midriff=true;
}
function tube(d,p,tex){ d.layer('top',5,p,tex); d.hw('top',29,35,y=>y<=33?5:4); d.midriff=true; }
function halter(d,p,tex){ d.layer('top',5,p,tex); d.hw('top',29,36,y=>y<=33?5:4);
  for(let i=0;i<6;i++){ const y=23+i, x=CXD-2-Math.floor(i/2); d.put('top',x,y); d.put('top',mxx(x),y); } d.midriff=true; }
function butterflyTop(d,p){
  d.layer('top',5,p); const hw={28:5,29:6,30:6,31:5,32:3,33:4,34:5,35:4};
  for(const y in hw) d.span('top',+y,CXD-hw[y],CXD+hw[y]-1);
  for(let i=0;i<5;i++){ const y=23+i,x=CXD-2-Math.floor(i/2); d.put('top',x,y); d.put('top',mxx(x),y); }
  for(let y=28;y<36;y++){ d.o(CXD-1,y,p.line); d.o(CXD,y,p.line); }
  d.o(CXD-4,30,'#ffffff',true); d.o(CXD-3,29,'#ff9ad5',true); d.o(CXD-3,34,'#ffffff',true); d.midriff=true;
}
function teePrint(d,kind){
  if(kind==='star'){ const m={28:[CXD-1,CXD],29:[CXD-3,CXD-2,CXD-1,CXD,CXD+1,CXD+2],30:[CXD-2,CXD-1,CXD,CXD+1],31:[CXD-2,CXD+1]};
    for(const y in m) for(const x of m[y]) d.o(x,+y,'#1a1a22'); d.o(CXD-1,33,'#ff5fa2'); d.o(CXD,33,'#ff5fa2'); }
  if(kind==='chart'){ for(const [x,y] of [[CXD-3,33],[CXD-2,32],[CXD-1,32],[CXD,31],[CXD+1,30],[CXD+2,29]]) d.o(x,y,'#2fae6a');
    d.o(CXD+1,29,'#2fae6a'); d.o(CXD+2,30,'#2fae6a'); for(let x=CXD-3;x<CXD+3;x++) d.o(x,34,'#7a6a8a'); }
  if(kind==='heart'){ for(const [x,y] of [[-2,29],[-1,29],[1,29],[2,29],[-3,30],[-2,30],[-1,30],[0,30],[1,30],[2,30],[-2,31],[-1,31],[0,31],[1,31],[-1,32],[0,32]]) d.o(CXD+x-0,y,'#ff3f8f'); d.o(CXD-2,29,'#ffd0e8'); }
}
// ---------- hats & accessories
function trucker(d,front,mesh,brim){
  d.layer('capmesh',10,PAL(mesh),(x,y,t,c,p)=>(x+y)%2?p.shade:c); d.layer('capfront',11,PAL(front)); d.layer('capbrim',12,PAL(brim));
  d.hw('capmesh',2,10,y=>({2:4,3:6})[y]??7); d.hw('capfront',3,9,y=>y===3?3:4); d.hw('capbrim',10,11,y=>y===10?7:6);
  d.o(CXD-1,6,brim); d.o(CXD,6,brim); d.o(CXD-2,7,brim); d.o(CXD+1,7,brim); d.o(CXD-1,7,'#ffd84a'); d.o(CXD,7,'#ffd84a');
}
function newsboy(d,p){ d.layer('cap',11,p); d.layer('capbrim',12,PAL('#2c2c34'));
  d.hw('cap',2,9,y=>({2:5,3:7,8:7,9:7})[y]??8); d.hw('capbrim',10,10,5); d.o(CXD-1,2,p.hi); d.o(CXD,2,p.hi); for(let y=4;y<9;y++) d.o(CXD-4,y,p.shade,true); }
function headband(d,c){ for(let x=CXD-6;x<CXD+6;x++){ d.o(x,7,c); d.o(x,8,mixc(hx(c),[0,0,0],.25)); } d.o(CXD-3,7,'#ffffff'); }
function clips(d){ for(const [x,y,c] of [[CXD-5,8,'#7fe0ff'],[CXD+3,9,'#ffe066'],[CXD-2,6,'#ff8fd8']]){ const dk=mixc(hx(c),[0,0,0],.3); d.o(x,y,c); d.o(x+1,y,c); d.o(x,y+1,dk); d.o(x+1,y+1,dk);} }
function tiara(d){ for(let x=CXD-4;x<CXD+4;x++) d.o(x,4,(x%2)?'#e8e8f8':'#b8b8d0'); for(const x of [CXD-4,CXD-2,CXD+1,CXD+3]) d.o(x,3,'#e8e8f8'); d.o(CXD-1,2,'#ff5fa2'); d.o(CXD,2,'#ff5fa2'); d.o(CXD-1,3,'#ff9ad5'); d.o(CXD,3,'#ff9ad5'); }
function shades(d){ for(const s of [0,1]){ const X=x=>s?mxx(x):x; for(let x=CXD-5;x<=CXD-2;x++){ d.o(X(x),14,'#2a1020'); d.o(X(x),15,'#ff6fb5'); } d.o(X(CXD-4),15,'#ffd0e8'); d.o(X(CXD-5),15,'#2a1020'); d.o(X(CXD-6),14,'#2a1020'); }
  d.o(CXD-1,14,'#2a1020'); d.o(CXD,14,'#2a1020'); }
function hoops(d){ for(const s of [0,1]){ const X=x=>s?mxx(x):x; d.o(X(CXD-7),17,'#ffd84a'); d.o(X(CXD-8),18,'#ffd84a'); d.o(X(CXD-8),19,'#e0b030'); d.o(X(CXD-7),20,'#ffd84a'); d.o(X(CXD-6),19,'#e0b030'); } }
function choker(d){ for(let x=CXD-2;x<CXD+2;x++) d.o(x,23,'#1a1022'); d.o(CXD-1,24,'#ff5fa2'); }
function shoulderBag(d,strap,bag){ let x=CXD-5,y=26; while(y<42){ d.o(x,y,strap); y++; if(y%2===0) x++; }
  const bx=CXD+5; for(let yy=41;yy<46;yy++) for(let xx=bx;xx<bx+5;xx++) d.o(xx,yy,(yy>41&&xx<bx+4)?bag:darkc(hx(bag),.7)); d.o(bx+1,42,'#ffffff'); d.o(bx+2,43,'#ffe066'); }
// held items
function clipboard(d){ const x0=CXD-13,y0=40; for(let y=y0;y<y0+11;y++)for(let x=x0;x<x0+7;x++){ const e=x===x0||x===x0+6||y===y0||y===y0+10; d.o(x,y,e?'#5b3a1e':'#a8743c'); }
  for(let y=y0+2;y<y0+9;y++)for(let x=x0+1;x<x0+6;x++) d.o(x,y,(y%2||x===x0+1)?'#ffffff':'#c9b6e8');
  for(let x=x0+2;x<x0+5;x++){ d.o(x,y0-1,'#c8c8d8'); d.o(x,y0,'#8a8a9a'); } d.o(x0+1,y0+3,'#ff5fa2'); d.o(x0+1,y0+5,'#ff5fa2'); }
function planner(d){ const x0=mxx(CXD-9)-2,y0=40; for(let y=y0;y<y0+10;y++)for(let x=x0;x<x0+7;x++){ let c='#ff6fb5'; if(x===x0||y===y0||y===y0+9||x===x0+6) c='#c23c80'; d.o(x,y,c); }
  for(let y=y0+1;y<y0+9;y++) d.o(x0+6,y,'#fff0f8'); d.o(x0+3,y0+3,'#ffffff'); d.o(x0+2,y0+4,'#ffd0e8'); d.o(x0+4,y0+4,'#ffffff'); d.o(x0+3,y0+5,'#ffffff'); }
function flipPhone(d){ const x0=mxx(CXD-9)-1,y0=41; for(let y=y0;y<y0+7;y++)for(let x=x0;x<x0+4;x++) d.o(x,y,x<x0+3?'#e9e4ff':'#a69bd0');
  d.o(x0+1,y0+1,'#7fe0ff'); d.o(x0+2,y0+1,'#7fe0ff'); d.o(x0+1,y0+2,'#4fb0e0'); d.o(x0+2,y0+2,'#4fb0e0'); d.o(x0+1,y0+4,'#ff8fd8'); d.o(x0+2,y0+5,'#ff8fd8');
  for(let y=y0-3;y<y0;y++) d.o(x0+3,y,'#6a6a7a'); d.o(x0+3,y0-4,'#ff5fa2'); d.o(x0-1,y0+7,'#ffe066'); d.o(x0-1,y0+8,'#ff5fa2'); }
function sidekick(d){ const x0=CXD-15,y0=43; for(let y=y0;y<y0+5;y++)for(let x=x0;x<x0+8;x++){ const e=y===y0||y===y0+4||x===x0||x===x0+7; d.o(x,y,e?'#c23c80':'#ff8fc8'); }
  for(let y=y0+1;y<y0+4;y++)for(let x=x0+2;x<x0+6;x++) d.o(x,y,(x+y)%3?'#bff0ff':'#ffffff'); d.o(x0+1,y0+2,'#ffffff'); d.o(x0+6,y0+2,'#ffffff');
  const hx0=x0+1,hy=y0+6; d.o(hx0+1,y0+5,'#8a8a9a'); for(const [dx,dy] of [[0,0],[2,0],[0,1],[1,1],[2,1],[1,2]]) d.o(hx0+dx,hy+dy,'#ff3f8f'); }
const ITEMS={clipboard,planner,flip:flipPhone,sidekick};

// ---------- wardrobe options (for dress-up panel)
const SKINS={
  cos:PAL('#e8b48c','#c98e66','#f8d4b4','#9a6040'), watchdog:PAL('#f8d8c0','#e0b090','#fff0e4','#b07858'), signal:PAL('#a8704a','#84502e','#c89068','#5a3018'),
  grok:PAL('#fce2d0','#e8bca0','#fff4ec','#b88a70'), meeting:PAL('#f4ccb0','#dca688','#ffe8d8','#a87050'), sandy:PAL('#f0c8a4','#d8a07c','#ffe4cc','#a06a48')};
const FACES={cos:{eye:'#6a3a1a',lip:'#d0506e',lipd:'#902a44'},watchdog:{eye:'#3a7ac0',lip:'#f07090',lipd:'#b04060'},signal:{eye:'#3a2010',lip:'#c85a7a',lipd:'#7a2a40',blush:'#c87a7a'},
  grok:{eye:'#5a8aa0',lip:'#f08aa0',lipd:'#b85070'},meeting:{eye:'#3a8a50',lip:'#f0607e',lipd:'#b03050'},sandy:{eye:'#4a90c0',lip:'#f27a98',lipd:'#b84a68'}};
const HAIRS={
  brunette:{label:'brunette + caramel',pal:['#4a2a1a','#2e180e','#a8703c','#1e0e06'],streak:'#c89050',seed:11},
  honey:{label:'honey blonde',pal:['#e8c060','#c09030','#fff0a8','#806010'],seed:4},
  platinum:{label:'platinum',pal:['#f4ecc8','#d4c490','#ffffff','#9a8a50'],seed:9},
  blackpink:{label:'black + pink streaks',pal:['#1e1a28','#0e0c14','#4a4060','#060408'],streak:'#ff5fa2',seed:5},
  sandy:{label:'sandy beach',pal:['#d8b070','#b08848','#fae0a8','#6a4818'],streak:'#f6dca0',seed:8},
  auburn:{label:'auburn',pal:['#b84a24','#8a3014','#f08a50','#5a1a08'],seed:2},
  bubblegum:{label:'bubblegum pink',pal:['#ff8fc8','#e060a8','#ffd8f0','#a02a6a'],seed:6},
  lavender:{label:'lavender',pal:['#b8a0f0','#8a70d0','#e8dcff','#5a3aa0'],streak:'#ffffff',seed:3},
  blueblack:{label:'blue-black + blue',pal:['#1a1e30','#0c0e18','#3a4a70','#04060a'],streak:'#5fc8ff',seed:12},
};
const TOPS={corset:'corset top',babytee:'baby tee',tube:'tube top',halter:'halter top',butterfly:'butterfly top',slipdress:'slip dress'};
const TOP_COLORS=['#24202c','#ffffff','#ff9ad5','#ff5fa2','#c45cf0','#a8d8ff','#7fdcd0','#fff07a','#ffb36b','#e03c3c','#b8e86a','#c0c0d0'];
const BOTTOMS={flares:'low-rise flares',mini:'mini skirt'};
const BOTTOM_COLORS=[['#2e3f7a',1],['#3a4a6a',1],['#6a90c8',1],['#8fb0e0',1],['#f6f2ff',0],['#202028',0],['#ff9ad5',0],['#b8a0f0',0],['#c8a070',0]];
const PRINTS={none:'no print',star:'star',heart:'heart',chart:'up-chart'};
const HATS={none:'no hat',trucker:'trucker cap',newsboy:'newsboy cap'};
const ACCS={sunglasses:'tinted shades',tiara:'tiara',headband:'headband',clips:'butterfly clips',hoops:'hoop earrings',choker:'choker',bag:'shoulder bag',belt:'chunky belt'};
const HAIRSTYLES={straight:'long straight',waves:'beachy waves',flip:'flipped bob',pony:'high pony'};
const DEFAULT_LOOKS={
  cos:{hair:'brunette',hairStyle:'waves',top:'corset',topColor:'#24202c',print:'none',bottom:'flares',bottomColor:'#2e3f7a',shoe:'#1a1a22',hat:'none',acc:['belt'],beltColor:'#c0c0d0',buckle:'#ff5fa2',item:'clipboard'},
  watchdog:{hair:'honey',hairStyle:'straight',top:'babytee',topColor:'#7fdcd0',print:'chart',bottom:'flares',bottomColor:'#8fb0e0',shoe:'#ffffff',hat:'trucker',acc:['belt','bag'],beltColor:'#ffffff',buckle:'#ffd84a',bagColor:'#e03c6e',item:null},
  signal:{hair:'blackpink',hairStyle:'flip',top:'tube',topColor:'#c45cf0',print:'none',bottom:'flares',bottomColor:'#3a4a6a',shoe:'#ff5fa2',hat:'none',acc:['belt','clips'],beltColor:'#ff5fa2',buckle:'#ffffff',item:'flip'},
  sandy:{hair:'sandy',hairStyle:'waves',top:'butterfly',topColor:'#a8d8ff',print:'none',bottom:'flares',bottomColor:'#6a90c8',shoe:'#ff9ad5',hat:'none',acc:['belt'],beltColor:'#fff6e0',buckle:'#ff6fb5',item:'sidekick'},
  grok:{hair:'platinum',hairStyle:'straight',top:'babytee',topColor:'#ffffff',print:'star',bottom:'flares',bottomColor:'#202028',shoe:'#c0c0d0',hat:'newsboy',acc:['belt','bag'],beltColor:'#d8d8e8',buckle:'#ffffff',bagColor:'#c0c0d0',item:null},
  meeting:{hair:'auburn',hairStyle:'waves',top:'halter',topColor:'#ff9ad5',print:'none',bottom:'flares',bottomColor:'#f6f2ff',shoe:'#ff6fb5',hat:'none',acc:['belt','headband'],beltColor:'#c23c80',buckle:'#ffd84a',item:'planner'},
};
const SPARKLY_TOPS=new Set(['tube','halter']);
function renderDollFrame(key,look,frame,holdItem=true){
  const d=new DollR(); const H=HAIRS[look.hair]||HAIRS.brunette;
  d.skin=SKINS[key]||SKINS.cos; d.hairpal=PAL(...H.pal); d.hairtex=H.streak?streakTex(H.seed,H.streak):hairTex(H.seed);
  dBody(d,d.skin,frame);
  const st=look.hairStyle; if(st==='flip') hairFlip(d); else if(st==='pony') hairPony(d); else hairLong(d,st==='waves',st==='waves'?42:44);
  const tp=PAL(look.topColor), tex=SPARKLY_TOPS.has(look.top)?sparkleTex(5):null;
  ({corset:()=>corset(d,tp,'#ff9ad5'),babytee:()=>babyTee(d,tp,null),tube:()=>tube(d,tp,tex),halter:()=>halter(d,tp,tex),butterfly:()=>butterflyTop(d,tp),slipdress:()=>slipdress(d,tp,sparkleTex(9))}[look.top]||(()=>babyTee(d,tp)))();
  if(look.top==='babytee'&&look.print&&look.print!=='none') teePrint(d,look.print);
  const bc=BOTTOM_COLORS.find(b=>b[0]===look.bottomColor)||[look.bottomColor,0];
  if(look.top!=='slipdress'){
    if(look.bottom==='mini'){ mini(d,PAL(look.bottomColor),bc[1]?denimTex:null); platforms(d,look.shoe||'#ff9ad5',look.shoe); }
    else flares(d,PAL(look.bottomColor),bc[1]?denimTex:null,look.shoe||'#ff9ad5');
    if(look.acc.includes('belt')) belt(d,PAL(look.beltColor||'#c0c0d0'),look.buckle||'#ff5fa2',look.beltColor==='#ffffff'||look.beltColor==='#d8d8e8');
  } else platforms(d,look.shoe||'#ff9ad5',look.shoe);
  const A=new Set(look.acc);
  if(look.hat==='trucker') trucker(d,'#ffffff','#e03c6e','#e03c6e'); else if(look.hat==='newsboy') newsboy(d,PAL('#2a2a32','#16161c','#5a5a6a'));
  else { if(A.has('headband')) headband(d,'#ff6fb5'); if(A.has('clips')) clips(d); if(A.has('tiara')) tiara(d); }
  dFace(d,FACES[key]||{});
  if(A.has('sunglasses')) shades(d);
  if(A.has('hoops')) hoops(d);
  if(A.has('choker')) choker(d);
  if(!d.typing){ if(A.has('bag')) shoulderBag(d,look.bagStrap||'#3a2a3a',look.bagColor||'#ff9ad5'); if(holdItem&&look.holdItem!==false&&look.item&&ITEMS[look.item]) ITEMS[look.item](d); }
  return d.render();
}
const DOLL_FRAMES=['idle','stepA','stepB','typeA','typeB'];
function buildDollSheet(key,look){
  const c=document.createElement('canvas'); c.width=DOLL_W*5; c.height=DOLL_H; const g=c.getContext('2d'); const id=g.createImageData(c.width,c.height);
  DOLL_FRAMES.forEach((f,fi)=>{ const col=renderDollFrame(key,look,f); for(const [k,v] of col){ const x=k%64,y=(k/64)|0, i=(y*c.width+fi*DOLL_W+x)*4; id.data[i]=v[0];id.data[i+1]=v[1];id.data[i+2]=v[2];id.data[i+3]=255; } });
  g.putImageData(id,0,0); return c;
}
