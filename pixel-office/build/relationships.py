#!/usr/bin/env python3
"""Compute evolving bot-to-bot relationships from the bots' own work logs. No AI calls; read-only on sources.
Sources (set with env vars, defaults shown):
  FINDINGS_DIR = ../shared/bot-findings   one <YYYY-MM-DD>.md per day; each bot appends "## <Bot Name> - <time>" sections
  GOALS_FILE   = ../shared/goals.md       the shared goals brief (used to see which bots' focus areas are in demand)
Output: data/relationships.json with ONLY abstract scores, mood labels and reason codes
(no account/lead names, no finding text), so it is safe to embed in the page."""
import json, os, re, glob, itertools, datetime, hashlib
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIND = os.environ.get('FINDINGS_DIR', os.path.join(_ROOT, '..', 'shared', 'bot-findings'))
GOALS = os.environ.get('GOALS_FILE', os.path.join(_ROOT, '..', 'shared', 'goals.md'))
OUT = os.path.join(_ROOT, 'data', 'relationships.json')
BOTS = {'cos': ['Clipboard Chloe', 'Chloe', 'Chief of Staff'], 'watchdog': ['Pipeline Paris', 'Paris', 'Pipeline Watchdog'],
        'signal': ['Signal Sienna', 'Sienna', 'Find the Signal'], 'sandy': ['Social Sandy', 'Sandy'],
        'grok': ['Get-It-Done Gigi', 'Gigi'], 'meeting': ['Minutes Madison', 'Madison', 'Meeting Helper']}
FOCUS = {'watchdog': r'pipeline|new.logo|deal', 'signal': r'signal|slack|pattern', 'sandy': r'linkedin|social', 'grok': r'inbound|lead routing|slipping',
         'meeting': r'meeting|notes|touch base|prep', 'cos': r'recap|weekly|organi[sz]'}
STOP = set('''The This That Next Not Nothing Draft Why Source Sources Hourly CRM Slack Gmail Calendar Drive GitHub
LinkedIn Google AM PM ICP GAP Tier Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec Mon Tue Wed Thu Fri Sat Sun Hi Would Quick Also Watching Skipped Data Known Corrected Nice Saw Both One
Notion GTM ABM CEO COO CMO VP CS Note Contact Us New Demo Scheduled Completed Expansion Sales Pipeline Prospect'''.split())
def bot_of(heading):
    for k, names in BOTS.items():
        if any(heading.lower().startswith(n.lower()) for n in names): return k
    return None
def entries(path):
    out = []; cur = None
    for line in open(path, errors='ignore'):
        m = re.match(r'^##\s+(.+?)\s+-\s+(.+)$', line.strip())
        if m:
            cur = {'bot': bot_of(m.group(1)), 'head': m.group(2), 'text': ''}; out.append(cur)
        elif cur: cur['text'] += line
    return [e for e in out if e['bot']]
def subjects(text):
    caps = re.findall(r"\b([A-Z][a-zA-Z&'.]+(?:\s+(?:[A-Z][a-zA-Z&'.]+|&|of)){0,3})", text)
    s = set()
    for c in caps:
        words = [w for w in c.split() if w not in STOP]
        if words and len(' '.join(words)) > 3: s.add(' '.join(words).lower())
    s |= set(re.findall(r'record/0-\d/(\d+)', text))
    return s
def signals(day):
    es = entries(os.path.join(FIND, day + '.md'))
    load = {k: 0 for k in BOTS}; subj = {k: set() for k in BOTS}; refs = {}
    for e in es:
        load[e['bot']] += 1; subj[e['bot']] |= subjects(e['text'])
        for k, names in BOTS.items():
            if k == e['bot']: continue
            if any(re.search(r'\b' + re.escape(n) + r'\b', e['text']) for n in names[:2]):
                pair = tuple(sorted((e['bot'], k))); refs[pair] = refs.get(pair, 0) + 1
    # dedupe/"already covered" notes count as resolved overlap
    resolved = {}
    for e in es:
        if re.search(r'already (covered|reported|delivered)|dedupe|skipped', e['text'], re.I):
            for k, names in BOTS.items():
                if k != e['bot'] and any(n in e['text'] for n in names[:2]):
                    pair = tuple(sorted((e['bot'], k))); resolved[pair] = resolved.get(pair, 0) + 1
    goals = open(GOALS, errors='ignore').read().lower() if os.path.exists(GOALS) else ''
    demand = {k: len(re.findall(FOCUS[k], goals)) for k in BOTS}
    return load, subj, refs, resolved, demand, len(es)
def mood(f, t, prev):
    if prev and prev['t'] - t >= 4 and prev['t'] >= 40: return 'making up'
    if t >= 55: return 'a little tense'
    if f >= 68 and t < 35: return 'besties'
    if f >= 50 and t >= 35: return 'friendly rivals'
    if f >= 45: return 'work buddies'
    return 'getting to know each other'
def main():
    days = sorted(os.path.basename(p)[:-3] for p in glob.glob(FIND + '/20??-??-??.md'))
    if not days: return
    data = json.load(open(OUT)) if os.path.exists(OUT) else {'history': {}}
    hist = data.get('history', {})
    for day in days:   # replay any day not yet scored (seeds from the earliest file), always recompute the latest
        if day in hist and day != days[-1]: continue
        prior = [d for d in sorted(hist) if d < day]; base = hist[prior[-1]] if prior else {}
        load, subj, refs, resolved, demand, n = signals(day)
        busy = max(load.values()) or 1; dmax = max(demand.values()) or 1
        today = {}
        for a, b in itertools.combinations(sorted(BOTS), 2):
            key = a + '|' + b; p = (a, b); prev = base.get(key, {'f': 50, 't': 20})
            overlap = len(subj[a] & subj[b]); h = refs.get(p, 0); r = resolved.get(p, 0)
            if 'cos' in p: h += load[b if a == 'cos' else a] and 1   # everyone hands findings to Chloe
            gap = abs(load[a] - load[b]) / busy if min(load[a], load[b]) == 0 and 'cos' not in p else 0
            focus = 1 if demand[a] / dmax > .3 and demand[b] / dmax > .3 else 0
            ft = min(95, 50 + 12 * h + 6 * r + 4 * focus + 2 * min(overlap, 3))
            tt = max(5, min(85, 20 + 6 * max(0, min(overlap, 5) - 2 * h - 2 * r) + 14 * gap - 5 * r))
            step = lambda cur, tgt: cur + max(-10, min(10, round((tgt - cur) * .35)))
            f, t = step(prev['f'], ft), step(prev['t'], tt)
            why = [w for w, c in [('handoffs', h), ('overlap', overlap and overlap > 2 * h + 2 * r), ('resolved', r), ('workload', gap), ('shared_focus', focus)] if c]
            today[key] = {'f': f, 't': t, 'mood': mood(f, t, prev if prior else None), 'why': why}
        hist[day] = today
    data = {'date': days[-1], 'updated': datetime.datetime.now().strftime('%b %-d, %Y, %-I:%M %p ') + datetime.datetime.now().astimezone().tzname(),
            'pairs': hist[days[-1]], 'history': {d: hist[d] for d in sorted(hist)[-30:]}}
    data['hash'] = hashlib.sha1(json.dumps(data['pairs'], sort_keys=True).encode()).hexdigest()[:12]
    json.dump(data, open(OUT, 'w'), indent=1)
    for k, v in sorted(data['pairs'].items(), key=lambda kv: -kv[1]['f']): print(f"{k:18s} f={v['f']:3d} t={v['t']:3d} {v['mood']:16s} {','.join(v['why'])}")
if __name__ == '__main__': main()
