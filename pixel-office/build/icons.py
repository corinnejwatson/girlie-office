# pixel favicon + apple-touch-icon (original art), and og.png from the desktop screenshot
from PIL import Image, ImageDraw
H = ["..XXX...XXX..", ".XPPPX.XPPPX.", "XPWPPPXPPPPPX", "XPWPPPPPPPPPX", "XPPPPPPPPPPPX", ".XPPPPPPPPPX.",
     "..XPPPPPPPX..", "...XPPPPPX...", "....XPPPX....", ".....XPX.....", "......X......"]
C = {'X': (194, 60, 128, 255), 'P': (255, 111, 181, 255), 'W': (255, 255, 255, 255)}
def heart(size, bg):
    im = Image.new('RGBA', (16, 16), bg); px = im.load()
    for y, row in enumerate(H):
        for x, ch in enumerate(row):
            if ch in C: px[x + 1, y + 3] = C[ch]
    for (x, y) in [(13, 1), (14, 2), (13, 2), (12, 2), (13, 3)]: px[x, y] = (255, 240, 122, 255)
    return im.resize((size, size), Image.NEAREST)
heart(32, (0, 0, 0, 0)).save('favicon.png')
a = Image.new('RGBA', (180, 180), (246, 214, 238, 255)); a.alpha_composite(heart(160, (0, 0, 0, 0)), (10, 14)); a.convert('RGB').save('apple-touch-icon.png')
import sys, os
# optional: make og.png (link-preview image) from a desktop screenshot you took of the page
shot = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'screenshots', 'desktop.png')
if os.path.exists(shot):
    im = Image.open(shot).convert('RGB'); W, Hh = im.size
    box = (11, 40, W - 11, Hh - 16)  # canvas area at 1440x900
    c = im.crop(box); crop_w, ch = c.size; tw = int(ch * 1200 / 630)
    if tw <= crop_w: c = c.crop(((crop_w - tw) // 2, 0, (crop_w - tw) // 2 + tw, ch))
    c.resize((1200, 630), Image.LANCZOS).save('og.png')
print('icons ok')
