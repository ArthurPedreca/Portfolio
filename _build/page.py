"""Wraps the history pages in the shared shell. Run from the site root: python3 _build/page.py"""
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
UPWORK = 'https://www.upwork.com/freelancers/~01f52910ffb0d32b70'
HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · Arthur Pedreca</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#111111">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:image" content="https://arthurpedreca.github.io/Portfolio/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preload" href="../assets/fonts/archivo-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
<header class="nav">
  <div class="nav-left">
    <a class="wordmark" href="../">Arthur Pedreca</a>
    <nav class="nav-links" aria-label="Sections">
      <a href="../#work">Work</a>
      <a href="../#prices">Prices</a>
      <a href="../#about">About</a>
    </nav>
  </div>
  <a class="action" href="{upwork}" rel="noopener">Hire me on Upwork</a>
</header>
<main>
"""
FOOT = """</main>
<footer class="foot">
  <p class="foot-name" aria-hidden="true">Arthur Pedreca</p>
  <div class="foot-line"><span>© 2026 Arthur Pedreca</span><a class="link" href="../">Back to the front page</a></div>
</footer>
<script src="../assets/js/site.js" defer></script>
</body>
</html>
"""
for src in sorted((ROOT / '_build' / 'src').glob('*.html')):
    body = src.read_text()
    meta = dict(re.findall(r'<!--\s*(\w+):\s*(.*?)\s*-->', body))
    body = re.sub(r'<!--\s*\w+:.*?-->\n?', '', body).replace('{upwork}', UPWORK)
    (ROOT / 'history').mkdir(exist_ok=True)
    (ROOT / 'history' / src.name).write_text(HEAD.format(title=meta['title'], desc=meta['desc'], upwork=UPWORK) + body + FOOT)
    print('wrote history/' + src.name)
