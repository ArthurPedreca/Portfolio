# Portfolio

Source for [arthurpedreca.github.io/Portfolio](https://arthurpedreca.github.io/Portfolio/), served by GitHub Pages from `main`.

- `index.html` is the whole front page. The GitHub calendar and the busy line read `data/status.json` from [ArthurPedreca/ArthurPedreca](https://github.com/ArthurPedreca/ArthurPedreca), which a GitHub Action rebuilds every six hours. A snapshot of that file ships inside the page, so it still renders if the fetch fails.
- The audit section is live: the policy rule is editable, and fixing it turns the light off the exposed data.
- `history/` holds the long reads. Edit `_build/src/` and run `python3 _build/page.py` (Pages ignores folders that start with `_`).
- Plain HTML, one stylesheet, one script, self-hosted Archivo (OFL). Art direction: "The dark room", from tasteskill v2.
