#!/usr/bin/env python3
"""Build pixel-office/index.html: one self-contained page (art, fonts and data embedded).
Inputs (all inside this folder, nothing is read from anywhere else):
  office.config.json      office name, sign, owner label, tagline
  build/bots.config.json  the six dolls (name, plate, desk, title, role, bubble)
  data/status.json        optional: each doll's public 'up to' line + vibe
  data/relationships.json optional: abstract friendship scores (see build/relationships.py)
Usage: python3 build/build.py   (needs Pillow: pip install pillow)"""
import base64, json, io, os, re, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
A = os.path.join(HERE, 'assets') + '/'
# Optional: if you run a privacy grep over the built page, random base64 (e.g. inside a font) can contain one of your
# search words by pure chance. Set SOFTEN_PATTERN to that same regex and soften() drops a space into each accidental
# match. Browsers ignore whitespace when decoding base64 data: URLs, so image/font bytes are unchanged.
#   SOFTEN_PATTERN='yourcompany|yourname' python3 build/build.py
_PRIV = re.compile(os.environ['SOFTEN_PATTERN'], re.I) if os.environ.get('SOFTEN_PATTERN') else None
def soften(uri):
    if not _PRIV: return uri
    head, _, body = uri.partition(',')
    return head + ',' + _PRIV.sub(lambda m: m.group()[0] + ' ' + m.group()[1:], body)
def uri_img(im):
    b = io.BytesIO(); im.save(b, 'PNG'); return soften('data:image/png;base64,' + base64.b64encode(b.getvalue()).decode())
def uri_file(p, mime):
    return soften(f'data:{mime};base64,' + base64.b64encode(open(p, 'rb').read()).decode())
def tint(path, color, lo=0.0):
    im = Image.open(path).convert('RGBA'); px = im.load()
    for x in range(im.size[0]):
        for y in range(im.size[1]):
            r, g, b, a = px[x, y]; l = (r+g+b)/765
            px[x, y] = tuple(int(c*(lo+(1-lo)*l*1.15)) for c in color) + (a,)
    return im
furn = {
 'desk': 'furniture/DESK/DESK_FRONT.png', 'pcback': 'furniture/PC/PC_BACK.png', 'pcfront1': 'furniture/PC/PC_FRONT_ON_1.png',
 'coffee': 'furniture/COFFEE/COFFEE.png', 'lplant': 'furniture/LARGE_PLANT/LARGE_PLANT.png', 'plant': 'furniture/PLANT/PLANT.png',
 'plant2': 'furniture/PLANT_2/PLANT_2.png', 'cactus': 'furniture/CACTUS/CACTUS.png', 'dshelf': 'furniture/DOUBLE_BOOKSHELF/DOUBLE_BOOKSHELF.png',
 'shelf': 'furniture/BOOKSHELF/BOOKSHELF.png', 'whiteboard': 'furniture/WHITEBOARD/WHITEBOARD.png', 'sofa': 'furniture/SOFA/SOFA_FRONT.png',
 'clock': 'furniture/CLOCK/CLOCK.png', 'stable': 'furniture/SMALL_TABLE/SMALL_TABLE_FRONT.png', 'ctable': 'furniture/COFFEE_TABLE/COFFEE_TABLE.png',
 'hplant': 'furniture/HANGING_PLANT/HANGING_PLANT.png', 'lpaint': 'furniture/LARGE_PAINTING/LARGE_PAINTING.png',
 'spaint': 'furniture/SMALL_PAINTING/SMALL_PAINTING.png', 'spaint2': 'furniture/SMALL_PAINTING_2/SMALL_PAINTING_2.png',
 'bin': 'furniture/BIN/BIN.png', 'pot': 'furniture/POT/POT.png', 'chairb': 'furniture/CUSHIONED_CHAIR/CUSHIONED_CHAIR_FRONT.png',
 'bench': 'furniture/CUSHIONED_BENCH/CUSHIONED_BENCH.png',
}
assets = {k: uri_img(Image.open(A+v).convert('RGBA')) for k, v in furn.items()}
assets['floor'] = uri_img(tint(A+'floors/floor_1.png', (236, 222, 255), .55))
assets['floorK'] = uri_img(tint(A+'floors/floor_7.png', (255, 214, 236), .5))
assets['carpet'] = uri_img(tint(A+'carpets/carpet_1.png', (255, 170, 214), .45))
fonts = dict(silk=uri_file(f'{HERE}/fonts/silkscreen.woff2', 'font/woff2'), bub=uri_file(f'{HERE}/fonts/rubikbubbles.woff2', 'font/woff2'))
cursor = uri_file(f'{HERE}/cursor.png', 'image/png'); icon = uri_file(f'{HERE}/favicon.png', 'image/png')

cfg = json.load(open(f'{ROOT}/office.config.json'))
OFFICE = {'name': cfg.get('office_name', 'Girlie Office'), 'short': cfg.get('office_short', 'Girlie HQ'),
          'sign': cfg.get('wall_sign', '✧ girlie ✧'), 'owner': cfg.get('owner_label', 'the boss'),
          'secret': (cfg.get('secret_word') or 'moon').lower(), 'tagline': cfg.get('tagline', '✧ a bot squad ✧'),
          'description': cfg.get('description', 'A pixel-art office where a bot squad works, dances, eats sushi and plays dress-up.')}
from html import escape as h
SRC = f'{HERE}/src'
js = 'const OFFICE=' + json.dumps({k: OFFICE[k] for k in ('sign', 'owner', 'secret')}) + ';\n' + '\n'.join(
    open(f'{SRC}/{f}').read() for f in ['dolls.js', 'core.js', 'draw.js', 'fun.js', 'visitors.js', 'eggs.js', 'rel.js', 'status.js', 'genie.js', 'music.js', 'ui.js'])
t = open(f'{SRC}/head.html').read() + '<script>\n' + js + '\n</script>\n</body>\n</html>\n'
t = (t.replace('__OFFICE_NAME__', h(OFFICE['name'])).replace('__OFFICE_SHORT__', h(OFFICE['short']))
      .replace('__TAGLINE__', h(OFFICE['tagline'])).replace('__DESCRIPTION__', h(OFFICE['description'])))

REL_PATH = f'{ROOT}/data/relationships.json'
_rel = json.load(open(REL_PATH)) if os.path.exists(REL_PATH) else {'pairs': {}}
REL = {'date': _rel.get('date', ''), 'pairs': {k: {'f': int(v['f']), 't': int(v['t']), 'mood': str(v['mood'])} for k, v in _rel.get('pairs', {}).items()}}
t = t.replace('__REL__', json.dumps(REL)).replace('__ASSETS__', json.dumps(assets)).replace('__SILK__', fonts['silk']).replace('__BUB__', fonts['bub']).replace('__CURSOR__', cursor).replace('__ICON__', icon)

# ---------- per-doll status (data/status.json): public 'up to' line + vibe check on the owner
STATUS_PATH = f'{ROOT}/data/status.json'
VIBES = ('thriving', 'chill', 'nervous', 'sure-shes-mad', 'relieved', 'proud')
_st = {}
try: _st = json.load(open(STATUS_PATH)) if os.path.exists(STATUS_PATH) else {}
except Exception as e: print('status.json unreadable, skipping status:', e, file=sys.stderr)
# share guard: public lines must not carry names, numbers, links or ids. Words with a capital letter are only OK at a
# sentence start or when they're a generic tool/word below; anything else drops the line.
SHARE_WORDS = {'I', "I'm", "I'll", "I've", "I'd", 'OK', 'ABM', 'CRM', 'GTM', 'LinkedIn', 'Notion', 'Drive', 'Google', 'Slack'}
def share_safe(x):
    x = str(x or '').strip()
    if not x or len(x) > 90: return None
    if re.search(r'\d|https?:|www\.|\.com|@|/', x, re.I): return None
    start = True
    for w in re.findall(r"[A-Za-z][\w'’-]*|[.!?…]+", x):
        if re.fullmatch(r'[.!?…]+', w): start = True; continue
        if w[0].isupper() and not start and w.strip("'’") not in SHARE_WORDS: return None
        start = False
    return x
def status_obj(b):
    v = None
    want = {b['key'].lower(), b['doll'].lower(), b['plate'].lower()}
    for k, val in (_st.get('dolls') or {}).items():
        if k.strip().lower() in want and isinstance(val, dict): v = val
    if not v: return None
    vibe = str(v.get('vibe', '')).strip().lower().replace('’', "'").replace("she's", 'shes').replace(' ', '-')
    if vibe not in VIBES: vibe = 'chill'
    up, line = share_safe(v.get('working_on_public')), share_safe(v.get('vibe_line'))
    for nm, raw, ok in (('working_on_public', v.get('working_on_public'), up), ('vibe_line', v.get('vibe_line'), line)):
        if raw and not ok: print(f'status: {nm} for {b["plate"]} failed the share guard, dropped', file=sys.stderr)
    return {'up': up or '', 'vibe': vibe, 'line': line or '', 'when': ''}

bots = []
for c in json.load(open(f'{HERE}/bots.config.json')):
    bots.append(dict(key=c['key'], id='', name=c.get('name', c['doll']), doll=c['doll'], plate=c['plate'], tag=c['doll'], desk=c['desk'],
                     title=c['title'], role=c['role'], bubble=c['bubble'], real=False, activity=None, when=None, status=status_obj(c)))
OG = ('<meta property="og:title" content="' + h(OFFICE['name']) + '"><meta property="og:description" content="' + h(OFFICE['description']) + '">'
      '<meta property="og:type" content="website"><meta name="twitter:card" content="summary">')
u = t.replace('__OGMETA__', OG).replace('__BOTS__', json.dumps(bots)).replace('__SHARE__', 'true').replace('__CREDIT_EXTRA__', '')
for a, r in [("'<a class=\"chat\" href=\"grokbot://app/v1/agent?id='+encodeURIComponent(b.id)+'\">Open chat ↗</a>'", "''"),
             ("'<div class=\"lbl\">LATEST ACTIVITY</div>'+act", "''")]:
    assert a in u, a
    u = u.replace(a, r)
out = f'{ROOT}/index.html'; open(out, 'w').write(u); print('wrote', out, len(u), 'bytes')
