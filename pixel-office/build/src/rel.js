// ---------- RELATIONSHIPS (data/relationships.json, computed by build/relationships.py from the bots' own work logs)
// Only abstract scores + mood labels are embedded (safe for the share copy). Cues are subtle and rare.
const REL=__REL__;
const BIOS={
  cos:'Color-codes everything, including her boba (taro, half sweet). Keeps the snack drawer stocked.',
  watchdog:'Morning person. Brown sugar boba, extra pearls. Has a spreadsheet for her houseplants.',
  signal:'Puzzle fan who spots patterns in the sushi belt. Strawberry matcha, no ice.',
  sandy:'Knows every emoji by heart. Taro milk tea, always photographed first.',
  grok:'Finishes the to-do list, then writes a new one for fun. Brown sugar, large.',
  meeting:'Takes notes in three pen colors. Strawberry matcha, always on time.',
};
const relOf=(a,b)=>REL.pairs[[a,b].sort().join('|')]||{f:50,t:20,mood:'work buddies'};
const BANTER={
  'besties':[['saved u a boba','ur the best'],['great minds tho','always']],
  'work buddies':[['nice handoff!','anytime'],['got a sec?','for u, yes']],
  'friendly rivals':[['u flagged my lead again??','great minds tho'],['beat u to it','this time']],
  'a little tense':[['we should sync…','ok, let\'s split it up'],['was that one mine?','let\'s check']],
  'making up':[['my bad on the overlap','all good, we\'re fine'],['split the list?','deal']],
  'getting to know each other':[['how do u take ur boba?','extra pearls'],['first week?','feels like it']],
};
function pickPartner(d){ // break-time buddy: weighted toward friendship, mostly avoids tense pairs
  const others=dolls.filter(o=>o!==d&&o.state==='work'); if(!others.length) return null;
  const w=others.map(o=>{ const r=relOf(d.b.key,o.b.key); return Math.max(4,r.f-(r.mood==='a little tense'?25:0)); });
  let x=Math.random()*w.reduce((a,b)=>a+b,0); for(let i=0;i<others.length;i++){ x-=w[i]; if(x<=0) return others[i]; } return others[0]; }
function chatLines(d,o){ const r=relOf(d.b.key,o.b.key), pool=BANTER[r.mood]||BANTER['work buddies'], l=vibeTalk(d,o,r.mood)||pool[(Math.random()*pool.length)|0];
  if(Math.random()<.3) RCUE.push({x:(d.x+o.x)/2,y:Math.min(d.y,o.y)-FEET-30,k:r.mood==='besties'?'spark':r.mood==='a little tense'?'cloud':null,T:2.2});
  return l; }
const RCUE=[];
function drawRelCues(dt){ for(const c of RCUE){ c.T-=dt; if(!c.k) continue; const x=Math.round(c.x), y=Math.round(c.y-(2.2-c.T)*3);
    ctx.globalAlpha=Math.min(1,c.T); if(c.k==='spark'){ sparkle(x,y,3,'#fff6a8'); sparkle(x+8,y+5,2,'#ffffff'); }
    else { px(x-5,y,11,4,'#b8b0c8'); px(x-3,y-2,6,2,'#c8c0d8'); px(x-2,y+5,1,2,'#7ab0e0'); px(x+2,y+6,1,2,'#7ab0e0'); } }
  ctx.globalAlpha=1; for(let i=RCUE.length-1;i>=0;i--) if(RCUE[i].T<=0) RCUE.splice(i,1); }
function relCardHtml(b){
  const others=BOTS.filter(o=>o.key!==b.key).map(o=>({o,r:relOf(b.key,o.key)}));
  if(!others.length) return '';
  const best=others.slice().sort((x,y)=>y.r.f-x.r.f)[0], riv=others.slice().sort((x,y)=>y.r.t-x.r.t)[0];
  return '<div class="lbl">FUN FACTS</div><p>'+esc(BIOS[b.key]||'')+'</p><div class="lbl">OFFICE FRIENDS</div><p>closest: '+esc(best.o.plate)+' ('+esc(best.r.mood)+')'+
    (riv.r.t>=35&&riv.o!==best.o?' · friendly rival: '+esc(riv.o.plate):'')+'</p>'; }
// Mochi progress (wisdom count) + visit stats, remembered on this device only 
const VARC_KEY='girlieOffice.visitors.v1'; let VARC={visits:0,secs:0,wisdom:0}; try{ VARC={...VARC,...JSON.parse(localStorage.getItem(VARC_KEY)||'{}')}; }catch(e){}
VARC.visits++; let varcSave=0; function saveVarc(){ try{ localStorage.setItem(VARC_KEY,JSON.stringify(VARC)); }catch(e){} } saveVarc();
function tickArc(dt){ VARC.secs+=dt; varcSave+=dt; if(varcSave>15){ varcSave=0; saveVarc(); } }
