// ---------- STATUS: each doll's 'up to' line + her vibe check on the owner (data/status.json, embedded by build.py).
// The share copy only ever receives the public 'up to' line. Cues stay subtle: a tiny pixel icon by her head,
// an occasional thought bubble, and both lines on her card.
const VIBE={
  thriving:{e:'✨',label:'thriving',c:'#c8901a',bg:'#fff4c8'}, proud:{e:'💖',label:'proud',c:'#c23c80',bg:'#ffe0f2'},
  chill:{e:'😌',label:'chill',c:'#1f7a5a',bg:'#d8fff0'}, relieved:{e:'😮‍💨',label:'relieved',c:'#4a6ab8',bg:'#e4ecff'},
  nervous:{e:'😅',label:'nervous',c:'#2a78b8',bg:'#dcf0ff'}, 'sure-shes-mad':{e:'😬',label:'sure she\'s mad',c:'#8a4fb8',bg:'#efe4ff'},
};
const stOf=d=>d&&d.b&&d.b.status;
const vibeOf=d=>{ const s=stOf(d); return s&&VIBE[s.vibe]?s.vibe:null; };
// tiny pixel cue beside her head (sprite-local: head spans x10-27, y3-20)
function drawVibe(d,dx,dy){
  const v=vibeOf(d); if(!v||d.twirl>0) return; const q=PHONE?1.5:1, t=perf*0.8+d.b.desk*1.37, X=dx+29, Y=dy+5;
  const P=(x,y,w,h,c)=>px(X+x*q,Y+y*q,w*q,h*q,c);
  if(v==='nervous'||v==='sure-shes-mad'){ const drop=(o,k)=>{ const u=((t+o)%2.6)/2.6; if(u>.8) return; ctx.globalAlpha=Math.min(1,(.8-u)*4);
      const y=2+Math.round(u*5)+k; P(1,y,1,1,'#3a8ad8'); P(0,y+1,3,2,'#7ec8ff'); P(1,y+1,1,1,'#ffffff'); P(1,y+3,1,1,'#3a8ad8'); ctx.globalAlpha=1; };
    drop(0,0); if(v==='sure-shes-mad') drop(1.3,-3); }
  else if(v==='thriving'||v==='proud'){ const k=(t*1.6)%3; if(k>2.1) return; const s=k<.5||k>1.6?1:2, c=v==='proud'?'#ff6fb5':'#ffd84a';
    sparkle(Math.round(X+2*q),Math.round(Y+1*q),s,c); if(s===2) px(Math.round(X+2*q),Math.round(Y+1*q),1,1,'#ffffff'); if(v==='proud'&&k<1.2) sparkle(Math.round(X+6*q),Math.round(Y+6*q),1,'#ffd6f0'); }
  else if(v==='chill'){ const b=Math.round(Math.sin(t*2)); ctx.globalAlpha=.85; P(0,3+b,2,1,'#5fd0a8'); P(2,2+b,2,1,'#5fd0a8'); P(4,3+b,2,1,'#5fd0a8'); ctx.globalAlpha=1; }
  else if(v==='relieved'){ const u=(t%3)/3; if(u>.7) return; ctx.globalAlpha=Math.max(0,.9-u*1.2); const o=Math.round(u*6);
    P(-2+o,13-o*.3,2,2,'#ffffff'); P(1+o,11-o*.4,3,3,'#ffffff'); P(1+o,11-o*.4,3,1,'#e4ecff'); ctx.globalAlpha=1; }
}
// what the rotating idle bubble shows next: her role line most of the time, sometimes a thought
let bubbleKind='role';
function pickBubbleKind(d){ const s=stOf(d); if(!s) return 'role'; const r=Math.random();
  if(r<.32&&s.line) return 'vibe'; if(r<.52&&s.up) return 'up'; return 'role'; }
function thoughtText(d,kind){ const s=stOf(d); if(!s) return null; return kind==='vibe'?s.line:kind==='up'?'up to: '+s.up:null; }
// cloud-ish thought bubble: soft lavender, wraps to 3 lines max, little circles instead of a pointer
function thoughtBubble(X,topY,text){
  const f=LF, fs=Math.round(8*f), lh=Math.round(11*f), pad=Math.round(6*f), maxW=Math.min(OW-24*f,(PHONE?160:176)*f);
  ctx.font=fs+'px Silk'; let lines=wrapLines(text,maxW);
  if(lines.length>3){ lines=lines.slice(0,3); let l=lines[2]; while(l.length&&ctx.measureText(l+'…').width>maxW) l=l.slice(0,-1); lines[2]=l.replace(/[\s,;:]+$/,'')+'…'; }
  const w=Math.max(...lines.map(l=>ctx.measureText(l).width)), tw=Math.round(w+pad*2), bh=Math.round(lines.length*lh+pad);
  const bx=Math.round(Math.max(4,Math.min(OW-tw-4,X-tw/2))); let by0=Math.round(topY-bh-9*f); if(by0<4) by0=4;
  ctx.fillStyle='#fbf6ff'; ctx.strokeStyle='#c9a8ff'; ctx.lineWidth=1; const gap=topY-(by0+bh);
  if(gap>5*f) for(const [ox,oy,r] of [[0,by0+bh+gap*.38,2.2*f],[2*f,topY-2.2*f,1.3*f]]){ ctx.beginPath(); ctx.arc(X+ox,oy,r,0,7); ctx.fill(); ctx.stroke(); }
  ctx.setLineDash([3*f,2*f]); roundRect(bx+.5,by0+.5,tw,bh,8*f,'#fbf6ff','#b07ad8'); ctx.setLineDash([]);
  ctx.textAlign='center'; ctx.fillStyle='#6a3aa0'; lines.forEach((l,i)=>ctx.fillText(l,bx+tw/2,by0+pad/2+lh*(i+0.78))); ctx.textAlign='left';
}
// card + tooltip bits
function vibeChip(v){ const V=VIBE[v]; return V?'<span class="vibe" style="background:'+V.bg+';color:'+V.c+'">'+V.e+' '+esc(V.label)+'</span>':''; }
function statusCardHtml(b){ const s=b.status; if(!s||(!s.up&&!s.line)) return '';
  return '<div class="status">'+(s.up?'<div class="lbl">UP TO</div><p>'+esc(s.up)+'</p>':'')+
    '<div class="lbl">VIBE CHECK ON '+esc(OFFICE.owner.toUpperCase())+'</div><p>'+vibeChip(s.vibe)+(s.line?' <span class="vl">“'+esc(s.line)+'”</span>':'')+'</p>'+
    (s.when?'<div class="asof">as of '+esc(s.when)+'</div>':'')+'</div>'; }
function statusTip(b){ const s=b.status; return s&&VIBE[s.vibe]?'<br>vibe: '+VIBE[s.vibe].e+' '+esc(VIBE[s.vibe].label):''; }
// break-room talk that knows how she's feeling: [opener, warm reply, drier reply (tense/rival pairs)]
const VIBE_TALK={
  nervous:[['is she upset w me?','nah, ur fine ♡','prob just busy'],['did i miss something?','u got this','check the notes?']],
  'sure-shes-mad':[['she\'s def mad at me','she\'s not, promise ♡','…triple-check it'],['re-checking everything','ur so thorough','good call tbh']],
  proud:[['she said bless!!','ugh, icon','nice.'],['team\'s in good shape','bc of u ♡','sure is']],
  thriving:[['on a roll today','love that for u','ok overachiever']],
  relieved:[['finally a real project','u earned it ♡','about time'],['no seller work today!','freedom ♡','lucky']],
  chill:[['how r u so calm?','boba + vibes','must be nice'],['she likes me. mostly','she does! ♡','mostly lol']],
};
function vibeTalk(d,o,mood){ const v=vibeOf(d); if(!v||Math.random()>.4) return null; const pool=VIBE_TALK[v], l=pool[(Math.random()*pool.length)|0];
  return [l[0],(mood==='a little tense'||mood==='friendly rivals')?l[2]:l[1]]; }
