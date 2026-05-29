/* ══════════════════════════════════════════════════
   AR Jewelry Try-On
   app.js
   ══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   PRODUCT DATA
   image: path to PNG (transparent background)
   svgKey: fallback SVG if image not found
   anchorType: how jewelry attaches to body
     'ring'     → ring finger landmarks 13 & 14
     'bangle'   → wrist landmark 0 + hand width
     'necklace' → face mesh chin + face width
   ───────────────────────────────────────────────────── */
const products = [
  {
    id: 1, type: 'ring', svgKey: 'ring_solitaire',
    image: 'assets/jewelry/rings/ring-solitaire.png',
    name: 'Aurora Solitaire',
    metal: '18k White Gold · Blue Topaz',
    price: '₹1,24,000',
    desc: 'A timeless solitaire crafted in 18-karat white gold, set with a cushion-cut blue topaz of exceptional clarity. The tapered band catches light with every movement, creating an ever-changing play of brilliance.',
    specs: [['Stone', 'Blue Topaz'], ['Metal', '18k White Gold'], ['Weight', '4.2g'], ['Setting', 'Prong']],
    anchorType: 'ring',
  },
  {
    id: 2, type: 'ring', svgKey: 'ring_eternity',
    image: 'assets/jewelry/rings/ring-eternity.png',
    name: 'Celestia Eternity',
    metal: '14k Yellow Gold · Amethyst',
    price: '₹86,500',
    desc: 'Eight hand-set amethysts encircle this refined eternity band, each stone chosen for its deep violet hue. A symbol of endless devotion, finished to a mirror polish.',
    specs: [['Stone', 'Amethyst ×8'], ['Metal', '14k Yellow Gold'], ['Weight', '3.8g'], ['Setting', 'Bezel']],
    anchorType: 'ring',
  },
  {
    id: 3, type: 'ring', svgKey: 'ring_gold_band',
    image: 'assets/jewelry/rings/ring-band.png',
    name: 'Soleil Band',
    metal: '22k Yellow Gold · Plain',
    price: '₹54,200',
    desc: 'Pure in its simplicity. This 22-karat hand-hammered gold band develops a rich patina over time, becoming more beautiful with every year it is worn.',
    specs: [['Metal', '22k Yellow Gold'], ['Finish', 'Hand-hammered'], ['Weight', '6.1g'], ['Width', '5mm']],
    anchorType: 'ring',
  },
  {
    id: 4, type: 'bangle', svgKey: 'bangle_plain',
    image: 'assets/jewelry/bangles/bangle-plain.png',
    name: 'Aurore Bangle',
    metal: '22k Yellow Gold',
    price: '₹1,82,000',
    desc: 'Forged from a single pour of 22-karat gold, this smooth bangle has a satisfying weight and a high-polish finish that captures and reflects every source of light around it.',
    specs: [['Metal', '22k Yellow Gold'], ['Diameter', '65mm'], ['Weight', '22g'], ['Finish', 'Mirror Polish']],
    anchorType: 'bangle',
  },
  {
    id: 5, type: 'bangle', svgKey: 'bangle_diamond',
    image: 'assets/jewelry/bangles/bangle-diamond.png',
    name: 'Starfall Bangle',
    metal: '18k White Gold · Sapphire',
    price: '₹3,45,000',
    desc: 'Twelve round-cut blue sapphires are set at equal intervals around this sculptural white gold bangle, evoking a constellation encircling the wrist.',
    specs: [['Stone', 'Blue Sapphire ×12'], ['Metal', '18k White Gold'], ['Weight', '18g'], ['Setting', 'Channel']],
    anchorType: 'bangle',
  },
  {
    id: 6, type: 'bangle', svgKey: 'bangle_twisted',
    image: 'assets/jewelry/bangles/bangle-twisted.png',
    name: 'Tresse Bangle',
    metal: '18k Tri-colour Gold',
    price: '₹2,18,000',
    desc: 'Three strands of yellow, white, and rose gold are twisted together in a continuous braid, creating a mesmerising interplay of warm and cool tones.',
    specs: [['Metal', '18k Tri-colour Gold'], ['Diameter', '63mm'], ['Weight', '20g'], ['Pattern', 'Twisted Braid']],
    anchorType: 'bangle',
  },
  {
    id: 7, type: 'necklace', svgKey: 'necklace_pendant',
    image: 'assets/jewelry/necklaces/necklace-pendant.png',
    name: 'Lumière Pendant',
    metal: '18k White Gold · Aquamarine',
    price: '₹96,500',
    desc: 'An aquamarine of glacier-like clarity hangs from a delicate curb chain, finished with a diamond-cut lobster clasp. The stone refracts light into cool blue flashes throughout the day.',
    specs: [['Stone', 'Aquamarine'], ['Metal', '18k White Gold'], ['Chain', '45cm Curb'], ['Pendant', '18mm']],
    anchorType: 'necklace',
  },
  {
    id: 8, type: 'necklace', svgKey: 'necklace_choker',
    image: 'assets/jewelry/necklaces/necklace-choker.png',
    name: 'Rivière Choker',
    metal: '14k Yellow Gold · Pearl',
    price: '₹1,58,000',
    desc: 'Five freshwater pearls of exceptional lustre are spaced along a polished gold bar choker. Understated yet unmistakable — a piece that elevates any neckline.',
    specs: [['Stone', 'Freshwater Pearl ×5'], ['Metal', '14k Yellow Gold'], ['Length', '38cm'], ['Width', '8mm']],
    anchorType: 'necklace',
  },
  {
    id: 9, type: 'necklace', svgKey: 'necklace_layered',
    image: 'assets/jewelry/necklaces/necklace-layered.png',
    name: 'Cascade Layered',
    metal: '18k Rose Gold · Pink Tourmaline',
    price: '₹2,08,000',
    desc: 'Three chains of graduated length cascade in perfect harmony, anchored by a pink tourmaline drop at the centre. Designed to be worn together or layered with existing pieces.',
    specs: [['Stone', 'Pink Tourmaline'], ['Metal', '18k Rose Gold'], ['Chains', '40 / 45 / 50cm'], ['Drop', '12mm']],
    anchorType: 'necklace',
  },
];

/* ─────────────────────────────────────────────────────
   IMAGE CACHE
   Pre-loads PNG assets; falls back to SVG drawing
   if image is missing or fails to load.
   ───────────────────────────────────────────────────── */
const imageCache = {};

function preloadImage(src) {
  return new Promise((resolve) => {
    if (imageCache[src]) return resolve(imageCache[src]);
    const img = new Image();
    img.onload  = () => { imageCache[src] = img; resolve(img); };
    img.onerror = () => resolve(null); // null = use SVG fallback
    img.src = src;
  });
}

function preloadAllImages() {
  return Promise.all(products.map(p => preloadImage(p.image)));
}

/* ─────────────────────────────────────────────────────
   SVG FALLBACK GENERATORS
   Used in the shop UI and as canvas fallback when
   PNG assets are not yet available.
   ───────────────────────────────────────────────────── */
const jewelrySVGs = {

  ring_solitaire: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <ellipse rx="${s*.28}" ry="${s*.12}" fill="none" stroke="#c9a84c" stroke-width="${s*.035}"/>
      <ellipse rx="${s*.28}" ry="${s*.12}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="${s*.012}"/>
      <rect x="${-s*.035}" y="${-s*.38}" width="${s*.07}" height="${s*.28}" fill="#c9a84c" rx="2"/>
      <polygon points="0,${-s*.44} ${-s*.09},${-s*.28} ${s*.09},${-s*.28}" fill="#a8d4e8" stroke="#c9a84c" stroke-width="${s*.012}"/>
      <polygon points="0,${-s*.44} ${-s*.045},${-s*.36} 0,${-s*.32} ${s*.045},${-s*.36}" fill="rgba(255,255,255,.6)"/>
    </g>`,

  ring_eternity: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <ellipse rx="${s*.3}" ry="${s*.13}" fill="none" stroke="#c9a84c" stroke-width="${s*.04}"/>
      ${[...Array(8)].map((_,i)=>{
        const a=(i/8)*Math.PI, x=Math.cos(a)*s*.3, y=Math.sin(a)*s*.13;
        return `<circle cx="${x}" cy="${y}" r="${s*.025}" fill="#e8d5f5" stroke="#c9a84c" stroke-width="${s*.008}"/>`;
      }).join('')}
    </g>`,

  ring_gold_band: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <ellipse rx="${s*.3}" ry="${s*.13}" fill="none" stroke="#9a7530" stroke-width="${s*.055}"/>
      <ellipse rx="${s*.3}" ry="${s*.13}" fill="none" stroke="#e8c84a" stroke-width="${s*.03}"/>
      <ellipse rx="${s*.3}" ry="${s*.13}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="${s*.01}" stroke-dasharray="${s*.04} ${s*.06}"/>
    </g>`,

  bangle_plain: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <circle r="${s*.34}" fill="none" stroke="#9a7530" stroke-width="${s*.07}"/>
      <circle r="${s*.34}" fill="none" stroke="#c9a84c" stroke-width="${s*.04}"/>
      <circle r="${s*.34}" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="${s*.015}"/>
    </g>`,

  bangle_diamond: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <circle r="${s*.34}" fill="none" stroke="#9a7530" stroke-width="${s*.065}"/>
      <circle r="${s*.34}" fill="none" stroke="#c9a84c" stroke-width="${s*.04}"/>
      ${[...Array(12)].map((_,i)=>{
        const a=(i/12)*Math.PI*2, x=Math.cos(a)*s*.34, y=Math.sin(a)*s*.34;
        return `<circle cx="${x}" cy="${y}" r="${s*.025}" fill="#b8e0ff" stroke="#c9a84c" stroke-width="${s*.007}"/>`;
      }).join('')}
    </g>`,

  bangle_twisted: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <circle r="${s*.34}" fill="none" stroke="#9a7530" stroke-width="${s*.07}"/>
      <circle r="${s*.34}" fill="none" stroke="#e8c84a" stroke-width="${s*.025}" stroke-dasharray="${s*.06} ${s*.04}"/>
      <circle r="${s*.34}" fill="none" stroke="#c9a84c" stroke-width="${s*.025}" stroke-dasharray="${s*.06} ${s*.04}" stroke-dashoffset="${s*.05}"/>
    </g>`,

  necklace_pendant: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <path d="M${-s*.35},${-s*.15} Q0,${-s*.05} ${s*.35},${-s*.15}" fill="none" stroke="#c9a84c" stroke-width="${s*.022}" stroke-linecap="round"/>
      <line x1="0" y1="${-s*.05}" x2="0" y2="${s*.1}" stroke="#c9a84c" stroke-width="${s*.015}"/>
      <polygon points="0,${s*.1} ${-s*.1},${s*.28} 0,${s*.22} ${s*.1},${s*.28}" fill="#a8d4e8" stroke="#c9a84c" stroke-width="${s*.012}"/>
      <polygon points="0,${s*.1} ${-s*.05},${s*.18} 0,${s*.14} ${s*.05},${s*.18}" fill="rgba(255,255,255,.6)"/>
      ${[...Array(7)].map((_,i)=>{
        const t=(i/6)-.5, x=t*s*.7, y=-s*.15+Math.abs(t)*s*.08;
        return `<circle cx="${x}" cy="${y}" r="${s*.018}" fill="#c9a84c"/>`;
      }).join('')}
    </g>`,

  necklace_choker: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <path d="M${-s*.38},${-s*.05} Q0,${s*.05} ${s*.38},${-s*.05}" fill="none" stroke="#9a7530" stroke-width="${s*.04}" stroke-linecap="round"/>
      <path d="M${-s*.38},${-s*.05} Q0,${s*.05} ${s*.38},${-s*.05}" fill="none" stroke="#c9a84c" stroke-width="${s*.022}" stroke-linecap="round"/>
      ${[...Array(5)].map((_,i)=>{
        const t=(i/4)-.5, x=t*s*.68, y=s*.05-Math.abs(t)*s*.1;
        return `<circle cx="${x}" cy="${y}" r="${s*.028}" fill="#e8d5a3" stroke="#c9a84c" stroke-width="${s*.009}"/>`;
      }).join('')}
    </g>`,

  necklace_layered: (s = 200) => `
    <g transform="translate(${s/2},${s/2})">
      <path d="M${-s*.36},${-s*.18} Q0,${-s*.06} ${s*.36},${-s*.18}" fill="none" stroke="#c9a84c" stroke-width="${s*.018}" stroke-linecap="round"/>
      <path d="M${-s*.32},${-s*.04} Q0,${s*.1} ${s*.32},${-s*.04}" fill="none" stroke="#c9a84c" stroke-width="${s*.018}" stroke-linecap="round"/>
      <path d="M${-s*.26},${s*.1} Q0,${s*.24} ${s*.26},${s*.1}" fill="none" stroke="#c9a84c" stroke-width="${s*.018}" stroke-linecap="round"/>
      <circle cx="0" cy="${s*.26}" r="${s*.045}" fill="#f5c6d0" stroke="#c9a84c" stroke-width="${s*.01}"/>
      <circle cx="0" cy="${s*.26}" r="${s*.022}" fill="rgba(255,255,255,.7)"/>
    </g>`,
};

/* ─────────────────────────────────────────────────────
   AR CANVAS DRAWING — PNG IMAGE
   Draws a PNG jewelry image onto the AR canvas,
   correctly rotated and scaled to the tracked anchor.

   anchor = { x, y, angle, size }
     x, y    — centre position on canvas (pixels)
     angle   — rotation in radians
     size    — reference size in pixels (used to scale image)
   ───────────────────────────────────────────────────── */

/**
 * Draw a PNG image centered at (x,y), rotated by angle,
 * scaled so the image's natural height maps to `size` px.
 * aspectRatio = image.width / image.height
 */
function drawImageAnchor(ctx, img, anchor) {
  if (!img) return;
  const { x, y, angle, size } = anchor;
  const aspect = img.naturalWidth / img.naturalHeight;
  const drawH  = size;
  const drawW  = size * aspect;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

/* ─────────────────────────────────────────────────────
   AR CANVAS DRAWING — SVG FALLBACK
   Replicates the original canvas drawing for each type.
   ───────────────────────────────────────────────────── */
function drawRingFallback(ctx, svgKey, anchor) {
  const { x, y, angle, size } = anchor;
  const r  = size * 0.5;
  const sw = size * 0.16;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (svgKey === 'ring_solitaire') {
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw * 1.2; ctx.stroke();
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw;       ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.4); ctx.lineTo(0, -r * 1.4);
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw * 0.6; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.65); ctx.lineTo(-r * 0.38, -r * 1.1);
    ctx.lineTo(0, -r * 1.2); ctx.lineTo(r * 0.38, -r * 1.1);
    ctx.closePath();
    ctx.fillStyle = 'rgba(168,212,232,.85)'; ctx.fill();
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw * 0.4; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.65); ctx.lineTo(-r * 0.15, -r * 1.38);
    ctx.lineTo(0, -r * 1.3); ctx.lineTo(r * 0.15, -r * 1.38);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fill();

  } else if (svgKey === 'ring_eternity') {
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw * 1.3; ctx.stroke();
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw;       ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI;
      ctx.beginPath();
      ctx.arc(Math.cos(a)*r, Math.sin(a)*r*0.42, r*0.1, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(232,213,245,.9)'; ctx.fill();
      ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw*0.3; ctx.stroke();
    }

  } else { // gold band
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw * 1.8; ctx.stroke();
    ctx.strokeStyle = '#e8c84a'; ctx.lineWidth = sw;       ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.lineWidth = sw * 0.4;
    ctx.setLineDash([sw * 0.6, sw * 0.8]); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawBangleFallback(ctx, svgKey, anchor) {
  const { x, y, angle, size } = anchor;
  const r  = size * 0.5;
  const sw = size * 0.18;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (svgKey === 'bangle_plain') {
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw * 1.4; ctx.stroke();
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw;       ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = sw*.3; ctx.stroke();

  } else if (svgKey === 'bangle_diamond') {
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw*1.3; ctx.stroke();
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw*.8;  ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i/12)*Math.PI*2;
      ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, r*.09, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(184,224,255,.9)'; ctx.fill();
      ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw*.22; ctx.stroke();
    }

  } else { // twisted
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.strokeStyle = '#9a7530'; ctx.lineWidth = sw*1.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.strokeStyle = '#e8c84a'; ctx.lineWidth = sw*.6;
    ctx.setLineDash([sw*.9, sw*.7]); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = sw*.6;
    ctx.lineDashOffset = sw*.8; ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawNecklaceFallback(ctx, svgKey, anchor) {
  const { x, y, size } = anchor;
  const w  = size;
  const sw = size * 0.025;

  ctx.save();
  ctx.translate(x, y);

  if (svgKey === 'necklace_pendant') {
    ctx.beginPath();
    ctx.moveTo(-w*.5, -w*.07); ctx.quadraticCurveTo(0, w*.07, w*.5, -w*.07);
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw; ctx.stroke();
    for (let i=0;i<=6;i++){
      const t=i/6-.5;
      ctx.beginPath();
      ctx.arc(t*w, -w*.07+Math.abs(t)*w*.14, w*.025, 0, Math.PI*2);
      ctx.fillStyle='#c9a84c'; ctx.fill();
    }
    ctx.beginPath(); ctx.moveTo(0,w*.07); ctx.lineTo(0,w*.19);
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw*.7; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,w*.19); ctx.lineTo(-w*.08,w*.31); ctx.lineTo(0,w*.25); ctx.lineTo(w*.08,w*.31); ctx.closePath();
    ctx.fillStyle='rgba(168,212,232,.88)'; ctx.fill();
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw*.5; ctx.stroke();

  } else if (svgKey === 'necklace_choker') {
    ctx.beginPath();
    ctx.moveTo(-w*.55,0); ctx.quadraticCurveTo(0,w*.12,w*.55,0);
    ctx.strokeStyle='#9a7530'; ctx.lineWidth=sw*2.5; ctx.stroke();
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw*1.5; ctx.stroke();
    for (let i=0;i<=4;i++){
      const t=i/4-.5;
      ctx.beginPath();
      ctx.arc(t*w*.9, w*.12-Math.abs(t)*w*.12, w*.05, 0, Math.PI*2);
      ctx.fillStyle='rgba(232,213,163,.9)'; ctx.fill();
      ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw*.4; ctx.stroke();
    }

  } else { // layered
    [[-.12,w*.9],[0,w*.72],[.12,w*.55]].forEach(([yOff,lw])=>{
      ctx.beginPath();
      ctx.moveTo(-lw/2,yOff*w); ctx.quadraticCurveTo(0,(yOff+.12)*w,lw/2,yOff*w);
      ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw; ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(0,w*.24,w*.06,0,Math.PI*2);
    ctx.fillStyle='rgba(245,198,208,.9)'; ctx.fill();
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=sw*.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,w*.24,w*.03,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.7)'; ctx.fill();
  }
  ctx.restore();
}

/* ─────────────────────────────────────────────────────
   LANDMARK → ANCHOR CALCULATOR
   Returns { x, y, angle, size } for each jewelry type
   based on the raw MediaPipe landmark arrays and the
   canvas draw dimensions.
   ───────────────────────────────────────────────────── */

/**
 * Convert a MediaPipe landmark {x,y} (0-1) to canvas pixel coords.
 * Both video and canvas are CSS mirrored (scaleX(-1)), so we
 * flip x here so the drawing is not double-mirrored.
 */
function lmToCanvas(lm, drawW, drawH, offsetX, offsetY) {
  return {
    x: (1 - lm.x) * drawW + offsetX,
    y:      lm.y  * drawH + offsetY,
  };
}

/** Euclidean distance between two {x,y} points */
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getRingAnchor(landmarks, drawW, drawH, offsetX, offsetY, scale) {
  const lm = (i) => lmToCanvas(landmarks[i], drawW, drawH, offsetX, offsetY);

  // Ring finger: 13 = PIP (upper), 14 = MCP (lower base)
  const pip = lm(13);
  const mcp = lm(14);

  // Position ring at PIP joint (looks more natural on finger)
  const cx = (pip.x + mcp.x) / 2;
  const cy = (pip.y + mcp.y) / 2;

  // Size = length of finger segment * factor
  const segLen = dist(pip, mcp);
  const size   = segLen * 1.1 * scale;

  // Angle = along finger axis
  const angle = Math.atan2(pip.y - mcp.y, pip.x - mcp.x) + Math.PI / 2;

  return { x: cx, y: cy, angle, size };
}

function getBangleAnchor(landmarks, drawW, drawH, offsetX, offsetY, scale) {
  const lm = (i) => lmToCanvas(landmarks[i], drawW, drawH, offsetX, offsetY);

  const wrist     = lm(0);
  const midMCP    = lm(9);   // middle finger MCP
  const indexMCP  = lm(5);
  const pinkyMCP  = lm(17);

  // Bangle sits just above the wrist — 20% up toward the palm
  const cx = wrist.x + (midMCP.x - wrist.x) * 0.18;
  const cy = wrist.y + (midMCP.y - wrist.y) * 0.18;

  // Size = hand width (index MCP to pinky MCP)
  const handWidth = dist(indexMCP, pinkyMCP);
  const size      = handWidth * 0.85 * scale;

  // Angle = perpendicular to wrist-to-palm axis
  const angle = Math.atan2(midMCP.y - wrist.y, midMCP.x - wrist.x) + Math.PI / 2;

  return { x: cx, y: cy, angle, size };
}

function getNecklaceAnchor(faceLandmarks, drawW, drawH, offsetX, offsetY, scale) {
  const lm = (i) => lmToCanvas(faceLandmarks[i], drawW, drawH, offsetX, offsetY);

  // Key face mesh points:
  //   152 = chin tip
  //   234 = left face edge (cheekbone)
  //   454 = right face edge (cheekbone)
  //    10 = forehead top
  const chin      = lm(152);
  const leftEdge  = lm(234);
  const rightEdge = lm(454);
  const forehead  = lm(10);

  const faceWidth  = dist(leftEdge, rightEdge);
  const faceHeight = dist(forehead, chin);

  // Centre X = midpoint of face edges
  const cx = (leftEdge.x + rightEdge.x) / 2;

  // Place necklace below chin — distance proportional to face height
  const cy = chin.y + faceHeight * 0.22;

  // Necklace display width ≈ face width + a little overhang
  const size  = faceWidth * 1.1 * scale;

  return { x: cx, y: cy, angle: 0, size };
}

/* ─────────────────────────────────────────────────────
   MASTER DRAW DISPATCHER
   Called every frame inside the render loop.
   ───────────────────────────────────────────────────── */
function drawJewelry(ctx, product, anchor) {
  if (!product || !anchor) return;

  ctx.save();
  ctx.globalAlpha = arOpacity;

  const img = imageCache[product.image] || null;

  if (img) {
    // ── PNG image path ──────────────────────────
    drawImageAnchor(ctx, img, anchor);
  } else {
    // ── SVG fallback path ───────────────────────
    if (product.type === 'ring') {
      drawRingFallback(ctx, product.svgKey, anchor);
    } else if (product.type === 'bangle') {
      drawBangleFallback(ctx, product.svgKey, anchor);
    } else {
      drawNecklaceFallback(ctx, product.svgKey, anchor);
    }
  }

  ctx.restore();
}

/* ─────────────────────────────────────────────────────
   APP STATE
   ───────────────────────────────────────────────────── */
let currentProduct  = null;
let arScale         = 1.0;
let arOpacity       = 1.0;
let handsModel      = null;
let faceModel       = null;
let arCamera        = null;
let arRunning       = false;
let lastHandResults = null;
let lastFaceResults = null;
let animFrameId     = null;

/* ─────────────────────────────────────────────────────
   PAGE NAVIGATION
   ───────────────────────────────────────────────────── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name + '-page').classList.add('active');
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);
}

/* ─────────────────────────────────────────────────────
   PRODUCT GRID RENDERER
   Shows PNG image if available, else SVG fallback.
   ───────────────────────────────────────────────────── */
function buildCardImage(product) {
  const img = imageCache[product.image];
  if (img) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy" />`;
  }
  // SVG fallback
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${jewelrySVGs[product.svgKey](200)}
  </svg>`;
}

function renderGrid(filter = 'all') {
  const grid     = document.getElementById('product-grid');
  const filtered = filter === 'all' ? products : products.filter(p => p.type === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openDetail(${p.id})">
      <div class="card-img-wrap">
        ${buildCardImage(p)}
        <div class="card-badge">${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</div>
      </div>
      <div class="card-info">
        <div class="card-cat sans">${p.type}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-metal sans">${p.metal}</div>
        <div class="card-price sans">${p.price}</div>
        <div class="card-ar-hint sans">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          Try it on →
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid(type);
}

/* ─────────────────────────────────────────────────────
   PRODUCT DETAIL
   ───────────────────────────────────────────────────── */
function openDetail(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;

  const imgWrap = document.getElementById('detail-img-wrap-inner');
  const img     = imageCache[currentProduct.image];
  if (img) {
    imgWrap.innerHTML = `<img src="${currentProduct.image}" alt="${currentProduct.name}" />`;
  } else {
    imgWrap.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${jewelrySVGs[currentProduct.svgKey](200)}
    </svg>`;
  }

  document.getElementById('detail-cat').textContent   = currentProduct.type.charAt(0).toUpperCase() + currentProduct.type.slice(1);
  document.getElementById('detail-name').textContent  = currentProduct.name;
  document.getElementById('detail-metal').textContent = currentProduct.metal;
  document.getElementById('detail-price').textContent = currentProduct.price;
  document.getElementById('detail-desc').textContent  = currentProduct.desc;
  document.getElementById('detail-specs').innerHTML   = currentProduct.specs.map(([l,v]) => `
    <div class="spec-item">
      <div class="spec-label sans">${l}</div>
      <div class="spec-val sans">${v}</div>
    </div>
  `).join('');

  showPage('detail');
}

/* ─────────────────────────────────────────────────────
   AR MODAL CONTROLS
   ───────────────────────────────────────────────────── */
function openAR() {
  if (!currentProduct) return;

  // Reset adjustments
  arScale   = 1.0;
  arOpacity = 1.0;
  document.getElementById('scale-val').textContent   = '1.0×';
  document.getElementById('opacity-val').textContent = '1.0';

  // Populate sidebar
  document.getElementById('ar-product-name').textContent = currentProduct.name;
  document.getElementById('ar-item-name').textContent    = currentProduct.name;
  document.getElementById('ar-item-cat').textContent     = currentProduct.type;

  const thumbWrap = document.getElementById('ar-thumb-inner');
  const img       = imageCache[currentProduct.image];
  if (img) {
    thumbWrap.innerHTML = `<img src="${currentProduct.image}" alt="${currentProduct.name}" />`;
  } else {
    thumbWrap.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${jewelrySVGs[currentProduct.svgKey](200)}
    </svg>`;
  }

  // Necklace-specific tip
  document.getElementById('necklace-tip').style.display =
    currentProduct.type === 'necklace' ? 'flex' : 'none';

  document.getElementById('ar-modal').classList.add('open');
  document.getElementById('ar-loading').classList.remove('hidden');

  startAR();
}

function closeAR() {
  document.getElementById('ar-modal').classList.remove('open');
  stopAR();
}

function adjustScale(delta) {
  arScale = Math.max(0.3, Math.min(3.0, parseFloat((arScale + delta).toFixed(1))));
  document.getElementById('scale-val').textContent = arScale.toFixed(1) + '×';
}

function adjustOpacity(delta) {
  arOpacity = Math.max(0.1, Math.min(1.0, parseFloat((arOpacity + delta).toFixed(1))));
  document.getElementById('opacity-val').textContent = arOpacity.toFixed(1);
}

/* ─────────────────────────────────────────────────────
   MEDIAPIPE AR ENGINE
   ───────────────────────────────────────────────────── */
async function startAR() {
  const video     = document.getElementById('ar-video');
  const canvas    = document.getElementById('ar-canvas');
  const statusEl  = document.getElementById('ar-status');
  const loadingEl = document.getElementById('ar-loading');

  arRunning = true;

  try {
    // ── Webcam ──────────────────────────────────
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
    });
    video.srcObject = stream;
    await new Promise(res => { video.onloadedmetadata = res; });
    await video.play();

    // Canvas syncs to its rendered pixel size (not CSS size)
    function syncCanvasSize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);

    const isNecklace = currentProduct && currentProduct.type === 'necklace';

    // ── MediaPipe Hands ─────────────────────────
    handsModel = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`
    });
    handsModel.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.55,
    });
    handsModel.onResults(r => { lastHandResults = r; });

    // ── MediaPipe Face Mesh (necklace only) ─────
    if (isNecklace) {
      faceModel = new FaceMesh({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${f}`
      });
      faceModel.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.5,
      });
      faceModel.onResults(r => { lastFaceResults = r; });
    }

    // ── MediaPipe Camera utility ─────────────────
    arCamera = new Camera(video, {
      onFrame: async () => {
        if (!arRunning) return;
        await handsModel.send({ image: video });
        if (isNecklace && faceModel) {
          await faceModel.send({ image: video });
        }
      },
      width: 1280,
      height: 720,
    });
    await arCamera.start();

    loadingEl.classList.add('hidden');

    // ── Render loop ──────────────────────────────
    function renderLoop() {
      if (!arRunning) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Compute cover-fit offsets ───────────────
      // The video CSS is object-fit:cover + scaleX(-1).
      // We must map landmark coords (0–1) into the same
      // pixel region so jewelry lines up exactly.
      const vw = canvas.width;
      const vh = canvas.height;
      const videoAspect  = video.videoWidth / video.videoHeight;
      const canvasAspect = vw / vh;

      let drawW, drawH, offsetX, offsetY;
      if (canvasAspect > videoAspect) {
        drawW   = vw;
        drawH   = vw / videoAspect;
        offsetX = 0;
        offsetY = (vh - drawH) / 2;
      } else {
        drawH   = vh;
        drawW   = vh * videoAspect;
        offsetX = (vw - drawW) / 2;
        offsetY = 0;
      }

      let tracking = false;

      // ── Hand tracking (ring + bangle) ───────────
      if (currentProduct && lastHandResults) {
        const handLMs = lastHandResults.multiHandLandmarks;
        if (handLMs && handLMs.length > 0) {
          tracking = true;
          handLMs.forEach(landmarks => {
            let anchor;
            if (currentProduct.type === 'ring') {
              anchor = getRingAnchor(landmarks, drawW, drawH, offsetX, offsetY, arScale);
            } else if (currentProduct.type === 'bangle') {
              anchor = getBangleAnchor(landmarks, drawW, drawH, offsetX, offsetY, arScale);
            }
            if (anchor) drawJewelry(ctx, currentProduct, anchor);
          });
        }
      }

      // ── Face tracking (necklace) ─────────────────
      if (currentProduct && currentProduct.type === 'necklace' && lastFaceResults) {
        const faceLMs = lastFaceResults.multiFaceLandmarks;
        if (faceLMs && faceLMs.length > 0) {
          tracking = true;
          const anchor = getNecklaceAnchor(faceLMs[0], drawW, drawH, offsetX, offsetY, arScale);
          drawJewelry(ctx, currentProduct, anchor);
        }
      }

      // ── Status bar ───────────────────────────────
      if (tracking) {
        statusEl.textContent = '✦ Tracking · ' + currentProduct.name;
        statusEl.className   = 'ar-status tracking';
      } else {
        statusEl.textContent = currentProduct.type === 'necklace'
          ? 'Face the camera clearly'
          : 'Show your hand to the camera';
        statusEl.className = 'ar-status';
      }

      animFrameId = requestAnimationFrame(renderLoop);
    }

    renderLoop();

  } catch (err) {
    loadingEl.innerHTML = `
      <div style="text-align:center;padding:24px">
        <div style="font-size:36px;margin-bottom:16px">📷</div>
        <div style="font-family:sans-serif;font-size:13px;color:rgba(255,255,255,.7);
                    max-width:260px;line-height:1.7;margin:0 auto">
          ${err.name === 'NotAllowedError'
            ? 'Camera access was denied.<br>Please allow camera permission and try again.'
            : 'Could not start camera.<br>' + err.message}
        </div>
      </div>`;
  }
}

function stopAR() {
  arRunning = false;

  if (animFrameId)  { cancelAnimationFrame(animFrameId); animFrameId = null; }
  if (arCamera)     { arCamera.stop(); arCamera = null; }

  const video = document.getElementById('ar-video');
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }

  if (handsModel) { handsModel.close(); handsModel = null; }
  if (faceModel)  { faceModel.close();  faceModel  = null; }

  lastHandResults = null;
  lastFaceResults = null;
}

/* ─────────────────────────────────────────────────────
   TOAST NOTIFICATION
   ───────────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Kick off image preload in background; render grid with SVG first
  renderGrid();

  // Once images load, re-render grid with real PNGs
  await preloadAllImages();
  renderGrid();

  // Modal backdrop click → close AR
  document.getElementById('ar-modal').addEventListener('click', function (e) {
    if (e.target === this) closeAR();
  });
});
