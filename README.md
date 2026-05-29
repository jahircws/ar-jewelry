# AR Jewelry Try-On Demo

## Folder Structure

```
ar-jewelry/
├── index.html              ← entry point (open in Chrome/Edge)
├── css/
│   └── style.css           ← all styles
├── js/
│   └── app.js              ← all logic (products, AR engine, drawing)
└── assets/
    └── jewelry/
        ├── rings/
        │   ├── ring-solitaire.png   ← Aurora Solitaire
        │   ├── ring-eternity.png    ← Celestia Eternity
        │   └── ring-band.png        ← Soleil Band
        ├── bangles/
        │   ├── bangle-plain.png     ← Aurore Bangle
        │   ├── bangle-diamond.png   ← Starfall Bangle
        │   └── bangle-twisted.png   ← Tresse Bangle
        └── necklaces/
            ├── necklace-pendant.png ← Lumière Pendant
            ├── necklace-choker.png  ← Rivière Choker
            └── necklace-layered.png ← Cascade Layered
```

---

## PNG Asset Requirements

| Property        | Requirement                                      |
|-----------------|--------------------------------------------------|
| **Format**      | PNG with **transparent background** (alpha)      |
| **Resolution**  | 500×500 px minimum, 1000×1000 px recommended     |
| **Orientation** | Jewelry facing straight (ring = top view)        |
| **Ring**        | Top-down view, band horizontal across image      |
| **Bangle**      | Top-down or slight angle, circle centred         |
| **Necklace**    | Laid flat, chain arc curving downward, centred   |
| **Padding**     | ~10% transparent padding on all sides            |

### Why transparent background?
Without alpha transparency the PNG will show a white/coloured box
over the person's skin, hiding the hand/neck behind a rectangle.

---

## Free PNG Sources

| Site | Notes |
|------|-------|
| [FreePNG.net](https://freepng.net) | Search "gold ring PNG", "gold bangle PNG" |
| [PNGWing](https://www.pngwing.com) | Large library, transparent jewelry |
| [StickPNG](https://www.stickpng.com) | Clean cutouts |
| [Flaticon](https://www.flaticon.com) | Stylised icons (attribution required) |
| Adobe Express / Remove.bg | Remove backgrounds from any jewelry photo |

---

## How PNG Images Are Used

1. On **page load**, `app.js` pre-loads all PNGs into `imageCache`.
2. If a PNG loads successfully → it's drawn on the AR canvas using `drawImageAnchor()`.
3. If a PNG is missing or fails → the SVG fallback is drawn automatically.
4. You can add images one at a time; the rest fall back to SVG until you add them.

---

## Running the Demo

1. Open `index.html` in **Chrome** or **Edge** (requires a server for local files).
2. To run locally without a server issue use:
   ```
   npx serve .
   ```
   or Python:
   ```
   python -m http.server 8080
   ```
3. Allow camera permission when prompted.
4. Click any product → **Try It On — AR**.

> ⚠️ Do NOT open index.html directly as a `file://` URL.  
> MediaPipe WASM files require HTTP — use a local server.

---

## Alignment Controls (in AR modal)

| Control | What it does |
|---------|-------------|
| **Scale −/+** | Make jewelry smaller or larger (0.3× to 3.0×) |
| **Opacity −/+** | Make jewelry more or less transparent |

---

## Adding a New Product

In `js/app.js`, add an entry to the `products` array:

```js
{
  id: 10,
  type: 'ring',          // 'ring' | 'bangle' | 'necklace'
  svgKey: 'ring_solitaire',  // fallback SVG key
  image: 'assets/jewelry/rings/ring-new.png',
  name: 'My New Ring',
  metal: '18k Gold',
  price: '₹50,000',
  desc: 'Description here.',
  specs: [['Metal', '18k Gold'], ['Weight', '3g']],
  anchorType: 'ring',    // same as type
},
```
