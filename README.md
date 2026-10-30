# Portfolio

Source for [arthurpedreca.github.io/Portfolio](https://arthurpedreca.github.io/Portfolio/), served by GitHub Pages from `main`.

- `index.html` is the status page. The activity bars and the availability pill read `data/status.json` from [ArthurPedreca/ArthurPedreca](https://github.com/ArthurPedreca/ArthurPedreca), which a GitHub Action rebuilds every six hours. The page ships with a snapshot of that file so it still renders if the fetch fails.
- `history/` holds the postmortems and release notes. Edit the sources in `_build/src/` and run `python3 _build/page.py` to regenerate them (Pages ignores folders that start with `_`).
- No build step and no framework: plain HTML, one stylesheet, one script, self-hosted IBM Plex.
