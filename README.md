# Narmatha Home Foods – React version (Vite)

Same design and content as the plain-HTML site in the parent folder, rebuilt in React with animations. It still builds to static files, so free hosting works.

## Run
```
npm install
npm run dev       # live preview at http://localhost:5173
npm run build     # outputs the finished site into dist/
```

## Deploy for free
- **Netlify:** drag the `dist/` folder onto app.netlify.com/drop (or connect a repo: build command `npm run build`, publish directory `dist`).
- **Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** upload the contents of `dist/` (the build uses relative paths, so a sub-folder works).

## Where to edit
- `src/config.js`: delivery rules (`FREE_KM`, `RATE_PER_KM`, `MAX_KM`), `MENU` items and prices, all Tamil/English text (`T`), WhatsApp number. Same format as in the plain site; see the parent README for the list of placeholders still to confirm.
- `index.html`: page title, meta tags, Open Graph image and the schema.org markup (replace `YOUR-DOMAIN`).
- `public/images/`: logo, favicon, hero image, share image.
- `src/styles.css`: design and animations.

## Animations
Scroll-reveal for sections, staggered hero headline, floating hero meal, pulsing call button, drifting kaavi stripes, menu rows that stagger in, and a calculator whose charge counts up while the ring dot glides to the new distance. All are plain CSS plus two small hooks in `src/hooks.js`, and all switch off when the visitor's device asks for reduced motion.
