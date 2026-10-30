"""Wraps article bodies in the shared page shell (nav, footer). Run: python3 _build/page.py"""
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · Arthur Pedreca</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#f7f7f5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0e12" media="(prefers-color-scheme: dark)">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:image" content="https://arthurpedreca.github.io/Portfolio/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preload" href="../assets/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="arrow" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></symbol>
  <symbol id="back" viewBox="0 0 16 16"><path d="M13 8H3M7 4 3 8l4 4"/></symbol>
  <symbol id="out" viewBox="0 0 16 16"><path d="M5 11 11 5M6 5h5v5"/></symbol>
</svg>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="../"><span class="logo">ap</span>Arthur Pedreca <span class="sub">/ status</span></a>
    <nav class="links" aria-label="Sections">
      <a href="../#history">History</a>
      <a href="../#services">Services</a>
      <a href="../#experience">Experience</a>
      <a href="../#contact">Contact</a>
    </nav>
    <a class="pill" href="../#contact"><i class="dot"></i><span data-k="note">Available for new projects</span></a>
  </div>
</header>
<main class="wrap">
"""
FOOT = """</main>
<footer>
  <div class="wrap">
    <span>© 2026 Arthur Pedreca</span>
    <span><a href="../">Back to the status page</a></span>
  </div>
</footer>
<script src="../assets/js/status.js" defer></script>
</body>
</html>
"""
for src in sorted((ROOT / '_build' / 'src').glob('*.html')):
    body = src.read_text()
    meta = dict(re.findall(r'<!--\s*(\w+):\s*(.*?)\s*-->', body))
    body = re.sub(r'<!--\s*\w+:.*?-->\n?', '', body)
    out = HEAD.format(title=meta['title'], desc=meta['desc']) + body + FOOT
    (ROOT / 'history' / src.name).write_text(out)
    print('wrote history/' + src.name)
