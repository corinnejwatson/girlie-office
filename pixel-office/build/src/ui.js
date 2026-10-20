// ---------- interaction
function worldPos(e){ const r=cv.getBoundingClientRect(), x=(e.clientX-r.left)/K, y=(e.clientY-r.top)/K; return PHONE?toWorld(x,y):{x,y}; }
function hit(p){ let best=null; for(const d of dolls){ if(d.state==='changing') continue; const top=d.y-FEET; if(p.x>d.x-11&&p.x<d.x+11&&p.y>top+2&&p.y<d.y+2){ if(!best||d.y>best.y) best=d; } } return best; }
const inRect=(p,r)=>p.x>=r.x0&&p.x<=r.x1&&p.y>=r.y0&&p.y<=r.y1;
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
cv.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'){ return; }
  const p=worldPos(e); hover=hit(p); hoverV=hover?null:hitVisitor(p);
  const r=wrap.getBoundingClientRect();
  if(hover){ tip.style.display='block';
    tip.innerHTML='<b>'+esc(hover.b.doll)+'</b>'+(hover.b.name!==hover.b.doll?' <span style="color:#b07ad8;font-size:9px">aka '+esc(hover.b.name)+'</span>':'')+'<br>'+esc(hover.b.real&&!SHARE?hover.b.bubble:('Role: '+hover.b.role.split(':')[0].split('.')[0]))+statusTip(hover.b)+'<br><i style="color:#b07ad8">click for her card ♡</i>';
  } else if(hoverV){ tip.style.display='block'; tip.innerHTML=visTip(hoverV);
  } else if(inRect(p,DRESS_AREA)){ tip.style.display='block'; tip.innerHTML='✨ <b>Dressing Room</b><br>click to restyle a doll'; }
  else if(inRect(p,{x0:BOOMBOX.x0,y0:BOOMBOX.y0-8,x1:BOOMBOX.x0+BOOMBOX.w,y1:BOOMBOX.y0+BOOMBOX.h+16})){ tip.style.display='block'; tip.innerHTML='📻 <b>Boombox</b><br>'+(!MUS.started?'click to start the music':musicOn()?'click to mute':'click to unmute')+'<br><i style="color:#b07ad8">♫ "Glitter Cache", an original track made live in your browser</i>'; }
  else if(p.x>=518&&p.x<=746&&p.y>=96&&p.y<=180){ tip.style.display='block'; tip.innerHTML='🧋 <b>Boba Bar</b><br>taro, strawberry matcha or brown sugar?'; }
  else if(Math.hypot(p.x-BALL.x,p.y-BALL.y)<BALL.r+6){ tip.style.display='block'; tip.innerHTML='🪩 click for <b>party mode</b>'; }
  else tip.style.display='none';
  const tw=tip.offsetWidth; let lx=e.clientX-r.left+14; if(lx+tw>r.width) lx=e.clientX-r.left-tw-10;
  tip.style.left=lx+'px'; tip.style.top=(e.clientY-r.top+10)+'px';
});
cv.addEventListener('mouseleave',()=>{hover=null;hoverV=null;tip.style.display='none';});
cv.addEventListener('click',e=>{
  const p=worldPos(e), d=hit(p);
  if(d){ selected=d; openCard(d); return; }
  const vv=hitVisitor(p); if(vv){ tapVisitor(vv); return; }
  if(READY&&eggClick(p)) return;
  if(Math.hypot(p.x-BALL.x,p.y-BALL.y)<BALL.r+(PHONE?10:6)){ if(!eggBall()) toParty(!party); return; }
  if(inRect(p,{x0:BOOMBOX.x0,y0:BOOMBOX.y0-8,x1:BOOMBOX.x0+BOOMBOX.w,y1:BOOMBOX.y0+BOOMBOX.h+16})){ musToggle(); burst(BOOMBOX.x0+32,BOOMBOX.y0+40); return; }
  if(p.x>SUSHI.x0&&p.x<SUSHI.x1&&p.y>SUSHI.top-6&&p.y<SUSHI.base){ FLOATS.push({x:p.x,y:p.y-24,text:SUSHI_LINES[(Math.random()*SUSHI_LINES.length)|0],t:2.5}); burst(p.x,p.y); return; }
  if(inRect(p,DRESS_AREA)&&!(selected&&e.shiftKey)){ openDress(selected||dolls[0]); return; }
  if(selected){ const ok=goTo(selected,p.x,p.y,'sent','✧ on my way ✧'); if(ok){ selected.afterEmo='♡ here!'; burst(p.x,p.y); } else { selected.emo='× can\'t go there'; selected.emoT=1.6; } }
});
// ---------- profile card
let cardDoll=null, pc=null;
function openCard(d){
  cardDoll=d; const b=d.b;
  const act=SHARE?'':b.real?'<p>'+esc(b.activity)+'</p><span class="tag real">real data · '+esc(b.when)+'</span>'
    :'<p>I couldn\'t read any recent activity for this bot, so the card shows her role above instead.</p><span class="tag">fallback · role only</span>';
  card.innerHTML='<button class="x" title="close">✕</button><div class="top"><canvas id="pc" width="'+(DW*2)+'" height="'+(DH*2)+'" style="width:'+(DW*2)+'px;height:'+(DH*2)+'px"></canvas><div>'+
   '<h2>'+esc(b.doll)+'</h2>'+(b.name!==b.doll?'<div class="aka">aka '+esc(b.name)+'</div>':'')+(b.title?'<span class="tag">'+esc(b.title)+'</span>':'')+
   '<div class="lbl">ROLE</div><p>'+esc(b.role)+'</p>'+(b.full&&!SHARE?'<details><summary>full profile</summary>'+esc(b.full)+'</details>':'')+
   '</div></div>'+statusCardHtml(b)+relCardHtml(b)+(SHARE?'':'<div class="lbl">LATEST ACTIVITY</div>'+act)+
   '<div class="btns">'+(SHARE?'':'<a class="chat" href="grokbot://app/v1/agent?id='+encodeURIComponent(b.id)+'">Open chat ↗</a>')+'<button class="btn pink" data-a="dress">Dress up ✨</button>'+
   '<button class="btn" data-a="home">Back to desk</button><button class="btn" data-a="break">Take a break</button></div>'+
   (SHARE?'':'<div style="font-size:8px;color:#b07ad8;margin-top:6px">id '+esc(b.id)+'</div>');
  const right=d.x<WW*0.55; card.style.left=right?'':'12px'; card.style.right=right?'12px':'';
  pc=document.getElementById('pc').getContext('2d'); card.style.display='block';
  card.querySelector('.x').onclick=()=>{ card.style.display='none'; cardDoll=null; selected=null; };
  card.querySelector('[data-a=home]').onclick=()=>{ goHome(d,true); d.emo='💻 back to work!'; d.emoT=2.5; };
  card.querySelector('[data-a=break]').onclick=()=>wander(d);
  card.querySelector('[data-a=dress]').onclick=()=>openDress(d);
}
function drawPortrait(){ if(!pc) return; pc.imageSmoothingEnabled=false; pc.clearRect(0,0,DW*2,DH*2); pc.drawImage(cardDoll.img,0,0,DW,DH,0,(Math.floor(perf*1.6)%2)*2,DW*2,DH*2); }
// ---------- dress-up panel
const dress=document.getElementById('dress'), dWho=document.getElementById('dWho'), dOpts=document.getElementById('dOpts'), dStat=document.getElementById('dStat');
const dPv=document.getElementById('dPv').getContext('2d'); let dDoll=null;
function openDress(d){ dDoll=d; dress.style.display='flex'; renderDress(); }
function closeDress(){ dress.style.display='none'; dDoll=null; }
document.getElementById('dX').onclick=closeDress; dress.addEventListener('click',e=>{ if(e.target===dress) closeDress(); });
function applyLook(look,msg){ SAVED[dDoll.b.key]=look; persist(); setLook(dDoll,clone(look)); if(cardDoll===dDoll) openCard(dDoll); poof(dDoll.x,dDoll.y-50); renderDress(); dStat.textContent=msg||'saved ✓ (sticks after reloads)'; }
document.getElementById('dRand').onclick=()=>applyLook(randomLook(dDoll.b.key),'random look saved ✓');
document.getElementById('dReset').onclick=()=>{ delete SAVED[dDoll.b.key]; persist(); setLook(dDoll,lookFor(dDoll.b.key)); if(cardDoll===dDoll) openCard(dDoll); renderDress(); dStat.textContent='back to her signature look ↺'; };
function chips(title,obj,cur,onpick){ return '<div class="grp"><b>'+title+'</b><div class="chips">'+Object.entries(obj).map(([k,v])=>'<button class="chip'+(cur===k?' on':'')+'" data-g="'+title+'" data-k="'+k+'">'+esc(typeof v==='string'?v:v.label)+'</button>').join('')+'</div></div>'; }
function swatches(title,list,cur){ return '<div class="grp"><b>'+title+'</b><div class="chips">'+list.map(c=>'<button class="sw'+(cur===c?' on':'')+'" style="background:'+c+'" data-g="'+title+'" data-k="'+c+'" title="'+c+'"></button>').join('')+'</div></div>'; }
function renderDress(){
  if(!dDoll) return; const L=dDoll.look;
  dWho.innerHTML=dolls.map((d,i)=>'<button class="'+(d===dDoll?'on':'')+'" data-i="'+i+'">'+esc(d.b.doll)+(SAVED[d.b.key]?' ♡':'')+'</button>').join('');
  dWho.querySelectorAll('button').forEach(b=>b.onclick=()=>{ dDoll=dolls[+b.dataset.i]; dStat.textContent=''; renderDress(); });
  const accChips='<div class="grp"><b>ACCESSORIES</b><div class="chips">'+Object.entries(ACCS).map(([k,v])=>'<button class="chip'+(L.acc.includes(k)?' on':'')+'" data-g="ACC" data-k="'+k+'">'+v+'</button>').join('')+
    (L.item?'<button class="chip'+(L.holdItem===false?'':' on')+'" data-g="ITEM" data-k="x">her '+({clipboard:'clipboard',planner:'pink planner',flip:'flip phone',sidekick:'sidekick phone'})[L.item]+'</button>':'')+'</div></div>';
  dOpts.innerHTML=chips('OUTFIT',TOPS,L.top)+swatches('TOP COLOR',TOP_COLORS,L.topColor)+
    (L.top==='babytee'?chips('TEE PRINT',PRINTS,L.print||'none'):'')+
    (L.top!=='slipdress'?chips('BOTTOMS',BOTTOMS,L.bottom)+swatches('BOTTOM COLOR',BOTTOM_COLORS.map(b=>b[0]),L.bottomColor):'')+
    swatches('SHOES',['#ff9ad5','#ff6fb5','#ffffff','#1a1a22','#c0c0d0','#c45cf0','#fff07a'],L.shoe)+
    chips('HAIR COLOR',HAIRS,L.hair)+chips('HAIR STYLE',HAIRSTYLES,L.hairStyle)+chips('HAT',HATS,L.hat)+accChips+
    '<div style="font-size:8.5px;color:#9a7ab8">Changes save automatically. Dolls with a saved look keep it; the others sometimes restyle themselves in the dressing room.</div>';
  dOpts.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{
    const g=b.dataset.g, k=b.dataset.k, look=clone(dDoll.look);
    if(g==='OUTFIT') look.top=k; else if(g==='TOP COLOR') look.topColor=k; else if(g==='TEE PRINT') look.print=k; else if(g==='BOTTOMS') look.bottom=k;
    else if(g==='BOTTOM COLOR') look.bottomColor=k; else if(g==='SHOES') look.shoe=k; else if(g==='HAIR COLOR') look.hair=k; else if(g==='HAIR STYLE') look.hairStyle=k; else if(g==='HAT') look.hat=k;
    else if(g==='ACC'){ const s=new Set(look.acc); s.has(k)?s.delete(k):s.add(k); look.acc=[...s]; }
    else if(g==='ITEM'){ look.holdItem=look.holdItem===false; }
    applyLook(look);
  });
}
function drawDressPreview(){ if(!dDoll) return; dPv.imageSmoothingEnabled=false; dPv.clearRect(0,0,108,288); dPv.drawImage(dDoll.img,0,0,DW,DH,0,(Math.floor(perf*1.6)%2)*3,108,288); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(dDoll) closeDress(); else { card.style.display='none'; cardDoll=null; selected=null; } } });
document.querySelectorAll('[data-pop]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const p=document.getElementById(b.dataset.pop), o=!p.classList.contains('open');
  document.querySelectorAll('.pop').forEach(x=>x.classList.remove('open')); document.querySelectorAll('[data-pop]').forEach(x=>x.classList.remove('on')); if(o){ p.classList.add('open'); b.classList.add('on'); } });
document.addEventListener('click',e=>{ if(!e.target.closest('.pop')) { document.querySelectorAll('.pop').forEach(x=>x.classList.remove('open')); document.querySelectorAll('[data-pop]').forEach(x=>x.classList.remove('on')); } });
// ---------- boot
load().then(()=>document.fonts.ready).then(()=>{ buildLayout(); buildGrid(); initDolls(); initMochi();
  const h=location.hash;
  if(h.startsWith('#demo')){
    const put=(d,x,y,mode,emo)=>{ d.x=x; d.y=y; d.state='poi'; d.mode=mode; d.emo=emo; d.stay=1e9; };
    put(dolls[0],...danceSpot(0),'dance','♪ dancing!'); put(dolls[3],...danceSpot(3),'dance','♪ dancing!');
    put(dolls[5],SEATS[1].x,SEATS[1].y,'eat','🍣 sushi break!'); SEATS[1].who=dolls[5]; dolls[5].seat=SEATS[1];
    put(dolls[2],SEATS[4].x,SEATS[4].y,'eat',null); SEATS[4].who=dolls[2]; dolls[2].seat=SEATS[4];
    put(dolls[4],BOOTH.door.x,BOOTH.door.y,null,'✨ new look!'); setLook(dolls[4],{...lookFor('grok'),top:'slipdress',topColor:'#c45cf0',hat:'none',acc:['sunglasses','hoops','tiara'],hairStyle:'pony'});
    poof(BOOTH.cx,BOOTH.y0+50); setInterval(()=>poof(BOOTH.cx,BOOTH.y0+50),1800);
    bubbleIdx=1; bubbleClock=1e9; dolls.forEach(x=>x.next=1e9); hover=dolls[1]; if(h!=='#demo'){ selected=dolls[4]; openCard(dolls[4]); }
    if(h==='#demo-dress') openDress(dolls[4]);
  }
  requestAnimationFrame(render); });
