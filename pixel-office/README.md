# ✧ The Girlie Office — pixel office ✧

A tiny pixel-art office where your six bots live: they work at their desks, take boba runs, dance under the disco ball, eat sushi off the belt and play dress-up. Click a doll for her card (role, what she's up to, her vibe check on you, office friends). There are secrets. ✧

![desktop](screenshots/desktop.png)

## Open it
Just open `index.html` in a browser. It's one self-contained file (art, fonts and music are all inside), so you can also host it anywhere static (GitHub Pages works).

## Make it yours
1. Edit `office.config.json`: office name, wall sign, what the genie and vibe card call you (`owner_label`), the secret night-mode word, tagline.
2. Edit `build/bots.config.json` if you rename bots or change roles.
3. Optional: edit `data/status.json` (each doll's public "up to" line + vibe). Your chief-of-staff bot can rewrite it daily.
4. Rebuild: `pip install pillow && ./refresh.sh`

`./refresh.sh --rel` also recomputes `data/relationships.json` (who's besties, who's friendly rivals) from your bots' shared findings files in `../shared/bot-findings/`. Only abstract scores and mood labels are stored, never finding text.

**Privacy guard:** `build/build.py` drops any public status line that contains digits, links, `@`, `/`, or words with a capital letter that aren't sentence starts or generic tool names. Keep config text generic too if you publish the page: no company, coworker or customer names.

**Grepping the built page?** `index.html` embeds fonts and sprites as base64, and random base64 can contain a short search word by pure chance. Rebuild with `SOFTEN_PATTERN='word1|word2' python3 build/build.py` (same regex as your grep) and the build drops a harmless space into each accidental match. Browsers ignore it.

## Screenshots
`build/shot.py` re-renders `screenshots/` with headless Chromium (`pip install playwright && playwright install chromium`).

## What's in here
| Path | What |
|---|---|
| `index.html` | the built page |
| `office.config.json` | names and labels |
| `data/status.json`, `data/relationships.json` | example data |
| `build/build.py` | builds `index.html` |
| `build/src/` | the page's HTML/JS (dolls, room, sushi bar, boba bar, disco, dressing room, Mochi the axolotl, music, easter eggs) |
| `build/dollz.py` | the original Python doll generator that `src/dolls.js` was ported from |
| `build/relationships.py` | friendship scores from the findings files |
| `build/icons.py` | favicon / touch icon / optional link-preview image |
| `build/assets/` | furniture, floor and carpet sprites from [Pixel Agents](https://github.com/pixel-agents-hq/pixel-agents) (MIT, see `build/PIXEL_AGENTS_LICENSE.txt`) |
| `build/fonts/` | Silkscreen + Rubik Bubbles (SIL OFL 1.1) |
| `quotes-sources.md` | where Mochi's philosopher quotes come from |

## Credits
Furniture, floors and décor: Pixel Agents (MIT). The dollz, outfits, disco, sushi bar, boba bar, dressing room, boombox, Mochi and the music ("Glitter Cache", synthesized live in the browser) are original pixel art and code.
