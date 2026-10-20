# Procedural early-2000s "dollz"-style pixel doll generator (original art).
import math, random
from PIL import Image

W, H = 36, 96
CX = 18

def hexc(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3))
def dark(c, f=0.55): return tuple(int(v*f) for v in c)
def pal(base, shade=None, hi=None, line=None):
    b = hexc(base)
    return dict(base=b, shade=hexc(shade) if shade else dark(b, .78),
                hi=hexc(hi) if hi else mix(b, (255, 255, 255), .45),
                line=hexc(line) if line else dark(b, .5))

def mx(x): return 2*CX-1-x

class Doll:
    def __init__(s):
        s.px = {}       # (x,y) -> layer name
        s.layers = {}   # name -> dict(z, pal, tex, noline)
        s.over = {}     # (x,y) -> rgb override
    def layer(s, name, z, p, tex=None, noline=False, shade=True):
        s.layers[name] = dict(z=z, pal=p, tex=tex, noline=noline, shade=shade)
    def put(s, L, x, y):
        if not (0 <= x < W and 0 <= y < H): return
        cur = s.px.get((x, y))
        if cur is None or s.layers[cur]['z'] <= s.layers[L]['z']:
            s.px[(x, y)] = L
    def span(s, L, y, x0, x1, sym=False):
        for x in range(min(x0, x1), max(x0, x1)+1):
            s.put(L, x, y)
            if sym: s.put(L, mx(x), y)
    def rows(s, L, spec, sym=True):
        # spec: list of (y0,y1,x0,x1) inclusive
        for (y0, y1, x0, x1) in spec:
            for y in range(y0, y1+1): s.span(L, y, x0, x1, sym)
    def hw(s, L, y0, y1, hwf):
        # centered half-width rows; hwf(y)->hw
        for y in range(y0, y1+1):
            h = hwf(y) if callable(hwf) else hwf
            if h > 0: s.span(L, y, CX-h, CX+h-1)
    def o(s, x, y, c, sym=False):
        c = hexc(c) if isinstance(c, str) else c
        s.over[(x, y)] = c
        if sym: s.over[(mx(x), y)] = c
    def erase(s, x, y):
        s.px.pop((x, y), None)

    def render(s):
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        col = {}
        # runs per layer per row
        byrow = {}
        for (x, y), L in s.px.items(): byrow.setdefault((L, y), []).append(x)
        for (L, y), xs in byrow.items():
            xs.sort(); runs = []; st = xs[0]; pv = xs[0]
            for x in xs[1:]:
                if x != pv+1: runs.append((st, pv)); st = x
                pv = x
            runs.append((st, pv))
            info = s.layers[L]; p = info['pal']
            for a, b in runs:
                n = b-a+1
                for x in range(a, b+1):
                    t = (x-a+.5)/n; c = p['base']
                    if info['shade'] and n >= 2:
                        if t > .74: c = p['shade']
                        elif t > .6 and (x+y) % 2 == 0: c = p['shade']
                        elif .12 < t < .3 and n >= 4 and (x+y) % 2 == 0: c = p['hi']
                    if info['tex']: c = info['tex'](x, y, t, c, p) or c
                    col[(x, y)] = c
        # inner lines
        for (x, y), L in s.px.items():
            info = s.layers[L]
            if info['noline']: continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                M = s.px.get((x+dx, y+dy))
                if M and M != L and s.layers[M]['z'] < info['z'] and not s.layers[M].get('nobelow'):
                    col[(x, y)] = info['pal']['line']; break
        for k, c in s.over.items():
            if k in col or True: col[k] = c
        # outer outline
        out = {}
        for x in range(W):
            for y in range(H):
                if (x, y) in col: continue
                nb = [col[(x+dx, y+dy)] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if (x+dx, y+dy) in col]
                if nb:
                    d = min(nb, key=lambda c: sum(c))
                    out[(x, y)] = dark(d, .42)
        col.update(out)
        for (x, y), c in col.items(): img.putpixel((x, y), (*c, 255))
        return img

def hash2(x, y=0, seed=0):
    return ((x*73856093) ^ (y*19349663) ^ (seed*83492791)) & 0xffff

def gloss(x, y, t, p):
    if y in (6, 7) and .2 < t < .62: return (255, 255, 255) if (y == 6 and .3 < t < .5) else p['hi']
    if y in (5, 8) and .25 < t < .55 and (x+y) % 2 == 0: return p['hi']
    return None

def hair_tex(seed):
    def f(x, y, t, c, p):
        g = gloss(x, y, t, p)
        if g: return g
        h = hash2(x, 0, seed) % 5
        if h == 0 and (y % 3) != 0: return p['hi']
        if h == 1 and y % 2 == 0: return mix(p['base'], p['hi'], .5)
        if h == 3 and t > .45: return p['shade']
        return c
    return f

def streak_tex(seed, streak):
    sc = hexc(streak)
    def f(x, y, t, c, p):
        g = gloss(x, y, t, p)
        if g: return g
        h = hash2(x, 0, seed) % 7
        if h == 0: return sc if y % 4 else mix(sc, (255, 255, 255), .4)
        if h == 2 and (y % 3) != 0: return p['hi']
        if h == 4 and t > .4: return p['shade']
        return c
    return f

def denim_tex(x, y, t, c, p):
    if 46 < y < 74 and .28 < t < .5 and (x+y) % 2 == 0: return p['hi']
    if hash2(x, y, 7) % 11 == 0: return p['shade']
    return c

def sparkle_tex(seed):
    def f(x, y, t, c, p):
        if hash2(x, y, seed) % 9 == 0: return (255, 255, 255)
        return c
    return f

# ---------------------------------------------------------------- body
def body(d, skin, frame):
    d.layer('backhair', 0, d.hairpal, d.hairtex, noline=True)
    d.layer('legs', 2, skin)
    d.layer('torso', 3, skin)
    d.layer('neck', 3, skin)
    d.layer('face', 4, skin)
    d.layer('arm', 8, skin)
    # face
    d.hw('face', 9, 21, lambda y: {9: 3, 10: 4, 18: 4, 19: 4, 20: 3, 21: 2}.get(y, 5))
    d.span('face', 15, CX-6, CX-6, sym=True); d.span('face', 16, CX-6, CX-6, sym=True)  # ears
    d.hw('neck', 22, 24, 2)
    d.hw('torso', 25, 46, lambda y: 5 if y == 25 else 6 if y <= 28 else 5 if y <= 33 else 4 if y <= 40 else 5)
    # legs
    step = {'stepA': (2, 0), 'stepB': (0, 2)}.get(frame, (0, 0))
    for side, lift in ((0, step[0]), (1, step[1])):
        segs = [(45, 50, CX-5, CX-1), (51, 57, CX-4, CX-1), (58, 80, CX-4, CX-2), (81, 88, CX-3, CX-2)]
        for (y0, y1, x0, x1) in segs:
            for y in range(y0, y1+1):
                yy = y - (lift if y > 62 else 0)
                for x in range(x0, x1+1):
                    d.put('legs', x if side == 0 else mx(x), yy)
    # arms
    typing = frame.startswith('type')
    for side in (0, 1):
        def P(x, y, L='arm'):
            d.put(L, x if side == 0 else mx(x), y)
        for y in range(25, 28): P(CX-7, y); P(CX-6, y)
        if not typing:
            sw = 0
            if frame == 'stepA': sw = 1 if side == 0 else -1
            if frame == 'stepB': sw = -1 if side == 0 else 1
            for y in range(27, 36): P(CX-8, y); P(CX-7, y)
            for y in range(36, 46):
                o = sw if y > 40 else 0
                P(CX-9+o, y); P(CX-8+o, y)
            for y in range(46, 50):
                o = sw
                P(CX-9+o, y); P(CX-8+o, y)
                if y in (47, 48): P(CX-10+o, y)
        else:
            up = (1 if (frame == 'typeA') == (side == 0) else 0)
            for y in range(27, 36): P(CX-8, y); P(CX-7, y)
            for x in range(CX-8, CX-2):
                P(x, 36-up); P(x, 37-up)
            P(CX-3, 35-up); P(CX-2, 36-up); P(CX-2, 37-up)
    d.typing = typing; d.step = step

def face(d, eye='#5a3a22', lip='#e0607e', lipd='#a8324f', brow=None, blush='#f2a0a8'):
    brow = brow or d.hairpal['line']
    for x in (CX-4, CX-3, CX-2):
        d.o(x, 13, brow, sym=True) if x != CX-4 else None
    d.o(CX-4, 14, '#2a1410', sym=True); d.o(CX-3, 14, '#2a1410', sym=True); d.o(CX-2, 14, '#2a1410', sym=True)
    d.o(CX-5, 14, '#2a1410', sym=True)  # wing
    d.o(CX-4, 15, '#ffffff', sym=True); d.o(CX-3, 15, eye, sym=True); d.o(CX-2, 15, dark(hexc(eye), .6), sym=True)
    d.o(CX-3, 16, mix(d.skin['base'], d.skin['shade'], .7), sym=True)
    d.o(CX-4, 17, blush, sym=True)
    d.o(CX, 17, d.skin['shade']); d.o(CX-1, 18, d.skin['shade'])
    d.o(CX-2, 19, lipd); d.o(CX+1, 19, lipd); d.o(CX-1, 19, lip); d.o(CX, 19, lip)
    d.o(CX-1, 20, '#ffd0dc'); d.o(CX, 20, lip)
    # navel
    if d.midriff: d.o(CX-1, 40, d.skin['shade'])

# ---------------------------------------------------------------- hair
def hair_long(d, wavy=False, length=40, front_locks=True):
    def w(y):
        base = 7 if y > 8 else {4: 4, 5: 5, 6: 6, 7: 6, 8: 7}.get(y, 7)
        if y > 26: base = 7 + (y-26)//6
        if wavy and y > 12: base += int(round(math.sin(y/2.2)))
        return base
    d.hw('backhair', 4, length, w)
    d.layer('fronthair', 9, d.hairpal, d.hairtex)
    d.hw('fronthair', 4, 10, lambda y: {4: 4, 5: 5, 6: 6, 7: 6, 8: 6, 9: 6, 10: 6}[y])
    # side-swept bang
    for y, (a, b) in {11: (CX-6, CX+1), 12: (CX-6, CX-1), 13: (CX-6, CX-4)}.items(): d.span('fronthair', y, a, b)
    for y in range(11, 13): d.span('fronthair', y, CX+3, CX+5)
    for y in range(13, 22): d.put('fronthair', CX-6, y); d.put('fronthair', mx(CX-6), y)
    for y in range(14, 20): d.put('fronthair', CX-5, y); d.put('fronthair', mx(CX-5), y)
    if front_locks:
        for y in range(20, length-4):
            wv = int(round(math.sin(y/2.2))) if wavy else 0
            for x in (CX-7+wv, CX-6+wv, CX-5+wv):
                d.put('fronthair', x, y); d.put('fronthair', mx(x), y)
    # cut face back out at center so locks don't cover face
    for y in range(13, 22):
        for x in range(CX-4, CX+4):
            if d.px.get((x, y)) == 'fronthair': d.erase(x, y); d.put('face', x, y)

def hair_flip(d):
    # shoulder-length flipped-out ends
    def w(y):
        if y < 9: return {4: 4, 5: 5, 6: 6, 7: 6, 8: 7}[y]
        if y < 24: return 7
        return {24: 8, 25: 9, 26: 9, 27: 8}.get(y, 0)
    d.hw('backhair', 4, 27, w)
    d.layer('fronthair', 9, d.hairpal, d.hairtex)
    d.hw('fronthair', 4, 11, lambda y: {4: 4, 5: 5, 6: 6, 7: 6, 8: 6, 9: 6, 10: 6, 11: 6}[y])
    for y in range(12, 24):
        for x in (CX-7, CX-6): d.put('fronthair', x, y); d.put('fronthair', mx(x), y)
    for y in range(12, 15): d.put('fronthair', CX-5, y); d.put('fronthair', mx(CX-5), y)
    for x in (CX-9, CX-8): d.put('fronthair', x, 24); d.put('fronthair', mx(x), 24)
    for y in (25,): 
        for x in (CX-10, CX-9): d.put('fronthair', x, y); d.put('fronthair', mx(x), y)
    for y in range(12, 22):
        for x in range(CX-4, CX+4):
            if d.px.get((x, y)) == 'fronthair': d.erase(x, y); d.put('face', x, y)

# ---------------------------------------------------------------- clothes
def flares(d, p, hem=89, tex=denim_tex, sole='#e8e0f0', solepal=None):
    d.layer('jeans', 6, p, tex)
    la, lb = d.step
    d.hw('jeans', 42, 50, 5)
    for side, lift in ((0, la), (1, lb)):
        for y in range(51, hem+1):
            if y <= 59: a, b = CX-5, CX-1
            elif y <= 72: a, b = CX-5, CX-2
            elif y <= 80: a, b = CX-6, CX-2
            else: a, b = CX-7, CX-2
            yy = y - (lift if y > 62 else 0)
            for x in range(a, b+1): d.put('jeans', x if side == 0 else mx(x), yy)
        # platform sole peeking
        d.layer('sole', 7, solepal or pal(sole))
        for y in (hem+1, hem+2):
            for x in range(CX-6, CX-1):
                d.put('sole', x if side == 0 else mx(x), y - lift)
    # seam
    for y in range(52, 60): d.o(CX-1, y, p['shade']); 
    # pocket stitch
    d.o(CX-4, 45, p['hi'], sym=True); d.o(CX-3, 46, p['hi'], sym=True)

def belt(d, p, buckle='#f4e9a0', y=42, studs=False):
    d.layer('belt', 7, p, noline=False)
    d.hw('belt', y, y+1, 5)
    for yy in (y, y+1):
        d.o(CX-1, yy, buckle); d.o(CX, yy, mix(hexc(buckle), (255, 255, 255), .5) if yy == y else hexc(buckle))
    d.o(CX-2, y, buckle); d.o(CX+1, y+1, buckle)
    if studs:
        for x in (CX-4, CX+3): d.o(x, y, '#ffffff')

def baby_tee(d, p, y1=35, sleeves=True, tex=None):
    d.layer('top', 5, p, tex)
    d.hw('top', 25, y1, lambda y: 5 if y == 25 else 6 if y <= 28 else 5 if y <= 33 else 4)
    # neckline
    for x in (CX-2, CX-1, CX, CX+1): d.erase(x, 25); d.put('torso', x, 25)
    d.erase(CX-1, 26); d.erase(CX, 26); d.put('torso', CX-1, 26); d.put('torso', CX, 26)
    if sleeves:
        d.layer('sleeve', 9, p, tex)
        for y in range(25, 30):
            for x in (CX-8, CX-7, CX-6): d.put('sleeve', x, y); d.put('sleeve', mx(x), y)
    d.midriff = True

def corset(d, p, lace='#d0c0e8'):
    d.layer('top', 5, p)
    d.hw('top', 29, 39, lambda y: 5 if y <= 33 else 4)
    d.span('top', 28, CX-4, CX-1, sym=True)
    for y in range(25, 28): d.put('top', CX-4, y); d.put('top', mx(CX-4), y)
    for y in range(30, 39):
        d.o(CX-1 if y % 2 else CX, y, lace)
    for y in range(30, 39, 2): d.o(CX-3, y, p['hi'], sym=True)
    d.midriff = True

def tube(d, p, tex=None):
    d.layer('top', 5, p, tex)
    d.hw('top', 29, 35, lambda y: 5 if y <= 33 else 4)
    d.midriff = True

def halter(d, p, tex=None):
    d.layer('top', 5, p, tex)
    d.hw('top', 29, 36, lambda y: 5 if y <= 33 else 4)
    for i, y in enumerate(range(23, 29)):
        x = CX-2-(i//2)
        d.put('top', x, y); d.put('top', mx(x), y)
    d.midriff = True

def trucker(d, front='#ffffff', mesh='#e03c6e', brim='#e03c6e'):
    d.layer('capmesh', 10, pal(mesh), lambda x, y, t, c, p: p['shade'] if (x+y) % 2 else c)
    d.layer('capfront', 11, pal(front))
    d.layer('capbrim', 12, pal(brim))
    d.hw('capmesh', 2, 10, lambda y: {2: 4, 3: 6, 4: 7}.get(y, 7))
    d.hw('capfront', 3, 9, lambda y: 3 if y == 3 else 4)
    d.hw('capbrim', 10, 11, lambda y: 7 if y == 10 else 6)
    # patch
    d.o(CX-1, 6, brim); d.o(CX, 6, brim); d.o(CX-2, 7, brim); d.o(CX+1, 7, brim); d.o(CX-1, 7, '#ffd84a'); d.o(CX, 7, '#ffd84a')

def newsboy(d, p):
    d.layer('cap', 11, p)
    d.layer('capbrim', 12, pal('#2c2c34'))
    d.hw('cap', 2, 9, lambda y: {2: 5, 3: 7, 4: 8, 5: 8, 6: 8, 7: 8, 8: 7, 9: 7}[y])
    d.hw('capbrim', 10, 10, 5)
    d.o(CX-1, 2, p['hi']); d.o(CX, 2, p['hi'])
    for y in range(4, 9): d.o(CX-4, y, p['shade'], sym=True)

def headband(d, c):
    for x in range(CX-6, CX+6): d.o(x, 7, c); 
    for x in range(CX-6, CX+6): d.o(x, 8, mix(hexc(c), (0, 0, 0), .25))
    d.o(CX-3, 7, '#ffffff')

def butterfly_clips(d):
    for (x, y, c) in ((CX-5, 8, '#7fe0ff'), (CX+3, 9, '#ffe066'), (CX-2, 6, '#ff8fd8')):
        d.o(x, y, c); d.o(x+1, y, c); d.o(x, y+1, mix(hexc(c), (0, 0, 0), .3)); d.o(x+1, y+1, mix(hexc(c), (0, 0, 0), .3))

def shoulder_bag(d, strap='#3a2a3a', bag='#ff9ad5', side=1):
    # strap from left shoulder diagonally to right hip
    pts = []
    x, y = CX-5, 26
    while y < 42:
        pts.append((x, y)); y += 1
        if y % 2 == 0: x += 1
    for (x, y) in pts: d.o(x, y, strap)
    bx = CX+5
    for yy in range(41, 46):
        for xx in range(bx, bx+5): d.o(xx, yy, bag if (yy > 41 and xx < bx+4) else dark(hexc(bag), .7))
    d.o(bx+1, 42, '#ffffff'); d.o(bx+2, 43, '#ffe066')

def clipboard(d):
    x0, y0 = CX-13, 40
    for y in range(y0, y0+11):
        for x in range(x0, x0+7):
            edge = x in (x0, x0+6) or y in (y0, y0+10)
            d.o(x, y, '#5b3a1e' if edge else '#a8743c')
    for y in range(y0+2, y0+9):
        for x in range(x0+1, x0+6): d.o(x, y, '#ffffff' if (y % 2 or x == x0+1) else '#c9b6e8')
    for x in range(x0+2, x0+5): d.o(x, y0-1, '#c8c8d8'); d.o(x, y0, '#8a8a9a')
    d.o(x0+1, y0+3, '#ff5fa2'); d.o(x0+1, y0+5, '#ff5fa2')

def planner(d):
    x0, y0 = mx(CX-9)-2, 40
    for y in range(y0, y0+10):
        for x in range(x0, x0+7):
            c = '#ff6fb5'
            if x == x0: c = '#c23c80'
            if y in (y0, y0+9) or x == x0+6: c = '#c23c80'
            d.o(x, y, c)
    for y in range(y0+1, y0+9): d.o(x0+6, y, '#fff0f8')
    d.o(x0+3, y0+3, '#ffffff'); d.o(x0+2, y0+4, '#ffffff'); d.o(x0+4, y0+4, '#ffffff'); d.o(x0+3, y0+5, '#ffffff')
    d.o(x0+2, y0+4, '#ffd0e8')

def flip_phone(d):
    x0, y0 = mx(CX-9)-1, 41
    for y in range(y0, y0+7):
        for x in range(x0, x0+4):
            d.o(x, y, '#e9e4ff' if x < x0+3 else '#a69bd0')
    d.o(x0+1, y0+1, '#7fe0ff'); d.o(x0+2, y0+1, '#7fe0ff'); d.o(x0+1, y0+2, '#4fb0e0'); d.o(x0+2, y0+2, '#4fb0e0')
    d.o(x0+1, y0+4, '#ff8fd8'); d.o(x0+2, y0+5, '#ff8fd8')
    for y in range(y0-3, y0): d.o(x0+3, y, '#6a6a7a')
    d.o(x0+3, y0-4, '#ff5fa2')
    # charm
    d.o(x0-1, y0+7, '#ffe066'); d.o(x0-1, y0+8, '#ff5fa2')

def tee_print(d, kind):
    if kind == 'star':
        for y, xs in {28: (CX-1, CX), 29: tuple(range(CX-3, CX+3)), 30: tuple(range(CX-2, CX+2)), 31: (CX-2, CX+1)}.items():
            for x in xs: d.o(x, y, '#1a1a22')
        d.o(CX-1, 33, '#ff5fa2'); d.o(CX, 33, '#ff5fa2')
    if kind == 'chart':
        for i, (x, y) in enumerate([(CX-3, 33), (CX-2, 32), (CX-1, 32), (CX, 31), (CX+1, 30), (CX+2, 29)]):
            d.o(x, y, '#2fae6a')
        d.o(CX+1, 29, '#2fae6a'); d.o(CX+2, 30, '#2fae6a')
        for x in range(CX-3, CX+3): d.o(x, 34, '#7a6a8a')


def butterfly_top(d, p):
    d.layer('top', 5, p)
    for y, hw in {28: 5, 29: 6, 30: 6, 31: 5, 32: 3, 33: 4, 34: 5, 35: 4}.items():
        d.span('top', y, CX-hw, CX+hw-1)
    for i, y in enumerate(range(23, 28)):
        x = CX-2-(i//2); d.put('top', x, y); d.put('top', mx(x), y)
    for y in range(28, 36): d.o(CX-1, y, p['line']); d.o(CX, y, p['line'])
    d.o(CX-4, 30, '#ffffff', sym=True); d.o(CX-3, 29, '#ff9ad5', sym=True); d.o(CX-3, 34, '#ffffff', sym=True)
    d.midriff = True

def sidekick(d):
    x0, y0 = CX-15, 43
    for y in range(y0, y0+5):
        for x in range(x0, x0+8):
            edge = y in (y0, y0+4) or x in (x0, x0+7)
            d.o(x, y, '#c23c80' if edge else '#ff8fc8')
    for y in range(y0+1, y0+4):
        for x in range(x0+2, x0+6): d.o(x, y, '#bff0ff' if (x+y) % 3 else '#ffffff')
    d.o(x0+1, y0+2, '#ffffff'); d.o(x0+6, y0+2, '#ffffff')
    # heart charm
    hx, hy = x0+1, y0+6
    d.o(hx+1, y0+5, '#8a8a9a')
    for (dx, dy) in ((0, 0), (2, 0), (0, 1), (1, 1), (2, 1), (1, 2)): d.o(hx+dx, hy+dy, '#ff3f8f')

def sandy_outfit(d, f):
    hair_long(d, wavy=True, length=42)
    butterfly_top(d, pal('#a8d8ff', '#78b0e8', '#e0f4ff', '#4a80b8'))
    flares(d, pal('#6a90c8', '#4a6ca8', '#a8c8f0'), sole='#ff9ad5')
    belt(d, pal('#fff6e0', '#e0d0b0', '#ffffff'), buckle='#ff6fb5')
    if not d.typing: sidekick(d)

# ---------------------------------------------------------------- bots
def make(bot, frame):
    d = Doll(); d.midriff = False
    B = BOTS[bot]
    d.skin = B['skin']; d.hairpal = B['hair']; d.hairtex = B['hairtex']
    body(d, d.skin, frame)
    B['outfit'](d, frame)
    face(d, **B.get('face', {}))
    return d.render()

def cos_outfit(d, f):
    hair_long(d, wavy=True, length=44)
    corset(d, pal('#24202c', '#141018', '#5a5070', '#08060a'), lace='#ff9ad5')
    flares(d, pal('#2e3f7a', '#1f2c5a', '#5c74b8'), sole='#1a1a22')
    belt(d, pal('#c0c0d0', '#8a8a9a', '#ffffff'), buckle='#ff5fa2')
    if not d.typing: clipboard(d)

def watchdog_outfit(d, f):
    hair_long(d, wavy=False, length=42)
    trucker(d)
    baby_tee(d, pal('#7fdcd0', '#4fb0a8', '#c8fff6'))
    tee_print(d, 'chart')
    flares(d, pal('#8fb0e0', '#6488c0', '#d0e4ff'), sole='#ffffff')
    belt(d, pal('#ffffff', '#d8d0e8', '#ffffff'), buckle='#ffd84a', studs=True)
    if not d.typing: shoulder_bag(d, strap='#e03c6e', bag='#e03c6e')

def signal_outfit(d, f):
    hair_flip(d)
    tube(d, pal('#c45cf0', '#9030c0', '#f0b8ff'), tex=sparkle_tex(3))
    flares(d, pal('#3a4a6a', '#26324a', '#6a7ca0'), sole='#ff5fa2')
    belt(d, pal('#ff5fa2', '#c23c80', '#ffb8dc'), buckle='#ffffff')
    butterfly_clips(d)
    if not d.typing: flip_phone(d)

def grok_outfit(d, f):
    hair_long(d, wavy=False, length=46)
    newsboy(d, pal('#2a2a32', '#16161c', '#5a5a6a'))
    baby_tee(d, pal('#ffffff', '#d8d4ec', '#ffffff'))
    tee_print(d, 'star')
    flares(d, pal('#202028', '#101016', '#4a4a5c'), tex=None, sole='#c0c0d0')
    belt(d, pal('#d8d8e8', '#9a9aaa', '#ffffff'), buckle='#ffffff', studs=True)
    if not d.typing: shoulder_bag(d, strap='#1a1a22', bag='#c0c0d0')

def meeting_outfit(d, f):
    hair_long(d, wavy=True, length=40)
    halter(d, pal('#ff9ad5', '#e060a8', '#ffd8f0'), tex=sparkle_tex(5))
    flares(d, pal('#f6f2ff', '#d8d0ec', '#ffffff'), tex=None, sole='#ff6fb5')
    belt(d, pal('#c23c80', '#8a2058', '#ff8fd0'), buckle='#ffd84a')
    headband(d, '#ff6fb5')
    if not d.typing: planner(d)

BOTS = {
    'cos': dict(skin=pal('#e8b48c', '#c98e66', '#f8d4b4', '#9a6040'),
                hair=pal('#4a2a1a', '#2e180e', '#a8703c', '#1e0e06'),
                hairtex=streak_tex(11, '#c89050'), outfit=cos_outfit,
                face=dict(eye='#6a3a1a', lip='#d0506e', lipd='#902a44')),
    'watchdog': dict(skin=pal('#f8d8c0', '#e0b090', '#fff0e4', '#b07858'),
                     hair=pal('#e8c060', '#c09030', '#fff0a8', '#806010'),
                     hairtex=hair_tex(4), outfit=watchdog_outfit,
                     face=dict(eye='#3a7ac0', lip='#f07090', lipd='#b04060')),
    'signal': dict(skin=pal('#a8704a', '#84502e', '#c89068', '#5a3018'),
                   hair=pal('#1e1a28', '#0e0c14', '#4a4060', '#060408'),
                   hairtex=streak_tex(5, '#ff5fa2'), outfit=signal_outfit,
                   face=dict(eye='#3a2010', lip='#c85a7a', lipd='#7a2a40', blush='#c87a7a')),
    'grok': dict(skin=pal('#fce2d0', '#e8bca0', '#fff4ec', '#b88a70'),
                 hair=pal('#f4ecc8', '#d4c490', '#ffffff', '#9a8a50'),
                 hairtex=hair_tex(9), outfit=grok_outfit,
                 face=dict(eye='#5a8aa0', lip='#f08aa0', lipd='#b85070')),
    'sandy': dict(skin=pal('#f0c8a4', '#d8a07c', '#ffe4cc', '#a06a48'),
                  hair=pal('#d8b070', '#b08848', '#fae0a8', '#6a4818'),
                  hairtex=streak_tex(8, '#f6dca0'), outfit=sandy_outfit,
                  face=dict(eye='#4a90c0', lip='#f27a98', lipd='#b84a68')),
    'meeting': dict(skin=pal('#f4ccb0', '#dca688', '#ffe8d8', '#a87050'),
                    hair=pal('#b84a24', '#8a3014', '#f08a50', '#5a1a08'),
                    hairtex=hair_tex(2), outfit=meeting_outfit,
                    face=dict(eye='#3a8a50', lip='#f0607e', lipd='#b03050')),
}
FRAMES = ['idle', 'stepA', 'stepB', 'typeA', 'typeB']

if __name__ == '__main__':
    import sys
    outdir = sys.argv[1]
    prev = Image.new('RGBA', (len(BOTS)*(W+4)*4, len(FRAMES)*H*4 // 2 + H*4), (220, 210, 255, 255))
    for bi, b in enumerate(BOTS):
        sheet = Image.new('RGBA', (W*len(FRAMES), H), (0, 0, 0, 0))
        for fi, f in enumerate(FRAMES):
            sheet.paste(make(b, f), (fi*W, 0))
        sheet.save(f'{outdir}/doll_{b}.png')
        big = make(b, 'idle').resize((W*4, H*4), Image.NEAREST)
        prev.paste(big, (bi*(W+4)*4, 0), big)
        for fi, f in enumerate(FRAMES[1:]):
            sm = make(b, f).resize((W*2, H*2), Image.NEAREST)
            prev.paste(sm, (bi*(W+4)*4 + (fi % 2)*W*2, H*4 + (fi//2)*H*2), sm)
    prev.save(f'{outdir}/dollz_preview.png')
