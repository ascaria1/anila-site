# Anila Scaria — Portfolio

A fast, static, JSON-driven personal portfolio. All copy lives in `assets/content.json`; HTML/CSS stay clean.

## Quick Start

```bash
# from project root
python -m http.server 5500   # or: npx http-server -p 5500
# open http://localhost:5500
```

## Edit Content

Update text, timelines, skills, and projects in:

```
assets/content.json
```

## Deploy (Netlify)

* **Drag & Drop** the project folder at app.netlify.com → *Add new site → Deploy manually*, **or** connect your repo.


## Structure

```
index.html
assets/
  content.json        # 🔧 site copy
  css/styles.css
  js/content-loader.js
  js/main.js
  img/
```

## Notes

* Favicon: `<link rel="icon" href="assets/img/favicon.png">`
* Long titles/skills are truncated gracefully via CSS line-clamp.
