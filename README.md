# automated-accessibility-enhancer-site

Project site for
[automated-accessibility-enhancer](https://github.com/t-nair/automated-accessibility-enhancer),
an open-source tool that fixes reading order and adds missing alt text in PowerPoint
files. Built as part of the University of Washington Advancing Accessibility for
Engineering Education initiative.

No build step and no dependencies:

```
index.html   the page
styles.css   light and dark themes
script.js    dark mode toggle and the "View more updates" button
```

## Running it locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Publishing

The site is static, so GitHub Pages can serve it as-is: Settings > Pages > Deploy
from a branch > `main` / root.

## Adding an update

Updates are plain HTML in the `<ol id="feed">` list in `index.html`, newest first.
The first three are shown as cards, and the rest appear behind "View more updates".

To add one, copy an existing `<li class="feed-item">`, put it at the top of the list,
and change:

- the `<time datetime="YYYY-MM-DD">` attribute and its text
- the `<span class="tag">` label (Release, Fixes, Infrastructure, Talk, Upcoming)
- the heading and paragraph

For an event that hasn't happened yet, use `class="feed-item is-upcoming"` and
`class="tag tag-upcoming"`. Once it's over, remove both.

## Accessibility checklist for changes

- One `h1`, and headings in order
- Visible focus styles on everything interactive
- Text contrast of at least 4.5:1 in both themes
- Don't use color as the only way to show something
- The page should still work with JavaScript turned off
