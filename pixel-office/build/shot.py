#!/usr/bin/env python3
"""Take fresh screenshots of index.html with headless Chromium (pip install playwright && playwright install chromium)."""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'index.html'); OUT = os.path.join(ROOT, 'screenshots')
async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        pg = await b.new_page(viewport={'width': 1440, 'height': 900})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(4000)
        await pg.screenshot(path=f'{OUT}/desktop.png')
        # open a doll's card (click the first desk's doll)
        await pg.mouse.click(141, 195); await pg.wait_for_timeout(800)  # Chloe's head at 1440x900
        await pg.screenshot(path=f'{OUT}/desktop-card.png')
        m = await b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        m.on('pageerror', lambda e: errs.append(str(e)))
        await m.goto(URL); await m.wait_for_timeout(4000)
        await m.screenshot(path=f'{OUT}/mobile.png')
        print('page errors:', errs or 'none')
        await b.close()
asyncio.run(main())
