/* ---------- küçük çizim yardımcıları ---------- */

function drawMiniHeart(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.3);
  ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy + size * 0.3);
  ctx.bezierCurveTo(cx - size, cy + size * 0.7, cx, cy + size * 0.9, cx, cy + size * 1.3);
  ctx.bezierCurveTo(cx, cy + size * 0.9, cx + size, cy + size * 0.7, cx + size, cy + size * 0.3);
  ctx.bezierCurveTo(cx + size, cy, cx, cy, cx, cy + size * 0.3);
  ctx.closePath();
  ctx.stroke();
}

function drawSparkle(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r * 0.25, cy - r * 0.25);
  ctx.lineTo(cx + r, cy); ctx.lineTo(cx + r * 0.25, cy + r * 0.25);
  ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r * 0.25, cy + r * 0.25);
  ctx.lineTo(cx - r, cy); ctx.lineTo(cx - r * 0.25, cy - r * 0.25);
  ctx.closePath();
  ctx.stroke();
}

function drawCloud(ctx, cx, cy, s, mode = "fill") {
  ctx.beginPath();
  ctx.arc(cx, cy, 14 * s, 0, Math.PI * 2);
  ctx.arc(cx + 16 * s, cy - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(cx + 34 * s, cy, 14 * s, 0, Math.PI * 2);
  if (mode === "stroke") ctx.stroke();
  else ctx.fill();
}

/* ---------- arka planlar (canvas'ın tabanına dolgu olarak boyanır) ---------- */

const BACKGROUNDS = [
  {
    key: "krem", label: "Krem", preview: "#FFF6EA",
    draw(ctx, w, h) {
      ctx.fillStyle = "#FFF6EA";
      ctx.fillRect(0, 0, w, h);
    },
  },
  {
    key: "pembe-bulut", label: "Pembe Bulut", preview: "linear-gradient(135deg,#FFE3F1,#E7DBFF)",
    draw(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#FFE3F1");
      g.addColorStop(1, "#E7DBFF");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      [[80, 60, 1], [230, 44, 0.7], [520, 90, 1.1], [420, 55, 0.6]].forEach(([cx, cy, s]) => drawCloud(ctx, cx, cy, s));
    },
  },
  {
    key: "puanli", label: "Puanlı", preview: "#EDE3FF",
    draw(ctx, w, h) {
      ctx.fillStyle = "#EDE3FF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      let row = 0;
      for (let y = 20; y < h; y += 34) {
        const offset = row % 2 ? 17 : 0;
        for (let x = 20 + offset; x < w; x += 34) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        row++;
      }
    },
  },
  {
    key: "kalpli", label: "Kalpli", preview: "#FFE0EC",
    draw(ctx, w, h) {
      ctx.fillStyle = "#FFE0EC";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,95,168,0.35)";
      ctx.lineWidth = 2;
      let row = 0;
      for (let y = 26; y < h; y += 50) {
        const offset = row % 2 ? 25 : 0;
        for (let x = 26 + offset; x < w; x += 50) {
          drawMiniHeart(ctx, x, y, 9);
        }
        row++;
      }
    },
  },
  {
    key: "gokkusagi", label: "Gökkuşağı", preview: "linear-gradient(180deg,#FFD9D9,#FFF3C4,#D9FFE3,#D9ECFF,#E7D9FF)",
    draw(ctx, w, h) {
      const colors = ["#FFD9D9", "#FFF3C4", "#D9FFE3", "#D9ECFF", "#E7D9FF"];
      const bandH = h / colors.length;
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(0, i * bandH, w, bandH + 1);
      });
    },
  },
  {
    key: "cizgili", label: "Çizgili", preview: "repeating-linear-gradient(45deg,#FFF3C4,#FFF3C4 14px,#FFE29A 14px,#FFE29A 28px)",
    draw(ctx, w, h) {
      ctx.fillStyle = "#FFF3C4";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.strokeStyle = "rgba(255,201,60,0.55)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.clip();
      for (let x = -h; x < w; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }
      ctx.restore();
    },
  },
];

/* ---------- çizgi film şablonları (üstteki katmana çizilir, boyanmaz) ---------- */

function drawCardTemplate(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(40, 30, w - 80, h - 60);
  ctx.setLineDash([]);
  ctx.font = "800 22px 'Baloo 2', sans-serif";
  ctx.fillStyle = "rgba(27,18,51,0.45)";
  ctx.textAlign = "center";
  ctx.fillText("MANİFEST KARTIM", w / 2, 58);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(27,18,51,0.5)";
  drawMiniHeart(ctx, w / 2, h / 2 + 10, 46);
  ctx.restore();
}

function drawCat(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.55)";
  ctx.fillStyle = "rgba(27,18,51,0.55)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const cx = w / 2, cy = h / 2 + 10, r = 100;

  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.75, cy - r * 0.6);
  ctx.lineTo(cx - r * 0.95, cy - r * 1.35);
  ctx.lineTo(cx - r * 0.25, cy - r * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.75, cy - r * 0.6);
  ctx.lineTo(cx + r * 0.95, cy - r * 1.35);
  ctx.lineTo(cx + r * 0.25, cy - r * 0.85);
  ctx.stroke();

  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.arc(cx + s * r * 0.35, cy - r * 0.1, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + r * 0.22);
  ctx.lineTo(cx + 8, cy + r * 0.22);
  ctx.lineTo(cx, cy + r * 0.32);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.32);
  ctx.quadraticCurveTo(cx - 18, cy + r * 0.5, cx - 34, cy + r * 0.38);
  ctx.moveTo(cx, cy + r * 0.32);
  ctx.quadraticCurveTo(cx + 18, cy + r * 0.5, cx + 34, cy + r * 0.38);
  ctx.stroke();

  [-1, 1].forEach((s) => {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + s * r * 0.5, cy + r * 0.12 + i * 10);
      ctx.lineTo(cx + s * (r * 0.5 + 48), cy + r * 0.02 + i * 14);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawBunny(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.55)";
  ctx.fillStyle = "rgba(27,18,51,0.55)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const cx = w / 2, cy = h / 2 + 45, r = 85;

  ctx.beginPath(); ctx.ellipse(cx - r * 0.4, cy - r * 1.5, 22, 70, -0.15, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + r * 0.4, cy - r * 1.5, 22, 70, 0.15, 0, Math.PI * 2); ctx.stroke();

  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.arc(cx + s * r * 0.32, cy - r * 0.05, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + r * 0.22);
  ctx.lineTo(cx + 6, cy + r * 0.22);
  ctx.lineTo(cx, cy + r * 0.3);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.3); ctx.lineTo(cx, cy + r * 0.42);
  ctx.moveTo(cx, cy + r * 0.42); ctx.quadraticCurveTo(cx - 16, cy + r * 0.55, cx - 30, cy + r * 0.42);
  ctx.moveTo(cx, cy + r * 0.42); ctx.quadraticCurveTo(cx + 16, cy + r * 0.55, cx + 30, cy + r * 0.42);
  ctx.stroke();

  [-1, 1].forEach((s) => {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + s * r * 0.55, cy + r * 0.2 + i * 8);
      ctx.lineTo(cx + s * (r * 0.55 + 40), cy + r * 0.12 + i * 12);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawButterfly(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.55)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const cx = w / 2, cy = h / 2;

  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.quadraticCurveTo(cx - 4, cy, cx, cy + 70);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 68); ctx.quadraticCurveTo(cx - 20, cy - 95, cx - 28, cy - 112);
  ctx.moveTo(cx, cy - 68); ctx.quadraticCurveTo(cx + 20, cy - 95, cx + 28, cy - 112);
  ctx.stroke();

  [1, -1].forEach((sign) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 50);
    ctx.bezierCurveTo(cx + sign * 150, cy - 140, cx + sign * 190, cy - 20, cx + sign * 40, cy - 8);
    ctx.bezierCurveTo(cx + sign * 190, cy + 40, cx + sign * 140, cy + 130, cx, cy + 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + sign * 90, cy - 55, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + sign * 85, cy + 40, 6, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawNightSky(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.55)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath(); ctx.arc(w * 0.78, h * 0.26, 38, 0, Math.PI * 2); ctx.stroke();
  [[-10, -8, 7], [8, 10, 5], [-2, 14, 4]].forEach(([dx, dy, r]) => {
    ctx.beginPath();
    ctx.arc(w * 0.78 + dx, h * 0.26 + dy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  drawSparkle(ctx, w * 0.15, h * 0.2, 10);
  drawSparkle(ctx, w * 0.34, h * 0.36, 7);
  drawSparkle(ctx, w * 0.55, h * 0.15, 8);
  drawSparkle(ctx, w * 0.1, h * 0.44, 6);

  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.5, h * 0.72);
  ctx.quadraticCurveTo(w * 0.75, h * 0.9, w, h * 0.68);
  ctx.stroke();

  [0.2, 0.42, 0.85].forEach((px) => {
    const tx = w * px, ty = h * 0.7;
    ctx.beginPath();
    ctx.moveTo(tx, ty - 34); ctx.lineTo(tx - 14, ty); ctx.lineTo(tx + 14, ty); ctx.closePath(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx, ty - 8); ctx.lineTo(tx - 4, ty + 6); ctx.lineTo(tx + 4, ty + 6); ctx.closePath(); ctx.stroke();
  });
  ctx.restore();
}

function drawMountains(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(27,18,51,0.55)";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath(); ctx.arc(w * 0.16, h * 0.22, 30, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(w * 0.16 + Math.cos(a) * 40, h * 0.22 + Math.sin(a) * 40);
    ctx.lineTo(w * 0.16 + Math.cos(a) * 54, h * 0.22 + Math.sin(a) * 54);
    ctx.stroke();
  }

  drawCloud(ctx, w * 0.65, h * 0.2, 1, "stroke");
  drawCloud(ctx, w * 0.4, h * 0.14, 0.7, "stroke");

  ctx.beginPath();
  ctx.moveTo(0, h * 0.85); ctx.lineTo(w * 0.22, h * 0.45); ctx.lineTo(w * 0.4, h * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.28, h * 0.85); ctx.lineTo(w * 0.52, h * 0.35); ctx.lineTo(w * 0.78, h * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.85); ctx.lineTo(w * 0.82, h * 0.55); ctx.lineTo(w, h * 0.85);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w * 0.46, h * 0.48); ctx.lineTo(w * 0.52, h * 0.35); ctx.lineTo(w * 0.58, h * 0.48);
  ctx.moveTo(w * 0.48, h * 0.46); ctx.lineTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.54, h * 0.44);
  ctx.stroke();
  ctx.restore();
}

const TEMPLATES = [
  { key: "kart", label: "Kart", emoji: "💌", draw: drawCardTemplate },
  { key: "kedi", label: "Kedi", emoji: "🐱", draw: drawCat },
  { key: "tavsan", label: "Tavşan", emoji: "🐰", draw: drawBunny },
  { key: "kelebek", label: "Kelebek", emoji: "🦋", draw: drawButterfly },
  { key: "gece", label: "Gece Manzarası", emoji: "🌙", draw: drawNightSky },
  { key: "daglar", label: "Dağ Manzarası", emoji: "⛰️", draw: drawMountains },
];

/* ---------- boyama uygulaması ---------- */

function initPaint() {
  const paintCanvas = document.getElementById("paintCanvas");
  const lineCanvas = document.getElementById("lineArtCanvas");
  if (!paintCanvas || !lineCanvas) return;

  const pctx = paintCanvas.getContext("2d");
  const lctx = lineCanvas.getContext("2d");
  const colorToolbar = document.getElementById("paintToolbar");
  const bgToolbar = document.getElementById("bgToolbar");
  const tplToolbar = document.getElementById("tplToolbar");
  const brushSize = document.getElementById("brushSize");
  const PALETTE = ["#1B1233", "#2FBF71", "#9D5CFF", "#FF5FA8", "#3E8EFF", "#FF4757", "#FFC93C", "#ffffff"];
  let currentColor = PALETTE[0];
  let currentBg = BACKGROUNDS[0].key;
  let currentTpl = TEMPLATES[0].key;
  let drawing = false;

  function paintBackground(key) {
    const bg = BACKGROUNDS.find((b) => b.key === key) || BACKGROUNDS[0];
    bg.draw(pctx, paintCanvas.width, paintCanvas.height);
  }

  function paintTemplate(key) {
    lctx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    const tpl = TEMPLATES.find((t) => t.key === key) || TEMPLATES[0];
    tpl.draw(lctx, lineCanvas.width, lineCanvas.height);
  }

  paintBackground(currentBg);
  paintTemplate(currentTpl);

  /* renk paleti */
  PALETTE.forEach((c, i) => {
    const s = document.createElement("button");
    s.type = "button";
    s.className = "swatch" + (i === 0 ? " active" : "");
    s.style.background = c;
    s.setAttribute("aria-label", `Renk: ${c}`);
    s.addEventListener("click", () => {
      currentColor = c;
      colorToolbar.querySelectorAll(".swatch").forEach((el) => el.classList.remove("active"));
      s.classList.add("active");
    });
    colorToolbar.appendChild(s);
  });

  /* arka plan seçimi */
  if (bgToolbar) {
    BACKGROUNDS.forEach((bg, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bg-swatch" + (i === 0 ? " active" : "");
      b.style.background = bg.preview;
      b.title = bg.label;
      b.setAttribute("aria-label", `Arka plan: ${bg.label}`);
      b.addEventListener("click", () => {
        currentBg = bg.key;
        bgToolbar.querySelectorAll(".bg-swatch").forEach((el) => el.classList.remove("active"));
        b.classList.add("active");
        paintBackground(currentBg);
      });
      bgToolbar.appendChild(b);
    });
  }

  /* şablon seçimi */
  if (tplToolbar) {
    TEMPLATES.forEach((tpl, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "song-pick" + (i === 0 ? " active" : "");
      btn.textContent = `${tpl.emoji} ${tpl.label}`;
      btn.addEventListener("click", () => {
        currentTpl = tpl.key;
        tplToolbar.querySelectorAll(".song-pick").forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");
        paintTemplate(currentTpl);
      });
      tplToolbar.appendChild(btn);
    });
  }

  function getPos(e) {
    const rect = paintCanvas.getBoundingClientRect();
    const scaleX = paintCanvas.width / rect.width;
    const scaleY = paintCanvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function startDraw(e) {
    drawing = true;
    const p = getPos(e);
    pctx.beginPath();
    pctx.moveTo(p.x, p.y);
    pctx.lineWidth = brushSize.value;
    pctx.lineCap = "round";
    pctx.strokeStyle = currentColor;
    pctx.lineTo(p.x, p.y);
    pctx.stroke();
    e.preventDefault();
  }

  function moveDraw(e) {
    if (!drawing) return;
    const p = getPos(e);
    pctx.lineWidth = brushSize.value;
    pctx.lineCap = "round";
    pctx.strokeStyle = currentColor;
    pctx.lineTo(p.x, p.y);
    pctx.stroke();
    e.preventDefault();
  }

  function endDraw() { drawing = false; }

  ["mousedown", "touchstart"].forEach((ev) => paintCanvas.addEventListener(ev, startDraw));
  ["mousemove", "touchmove"].forEach((ev) => paintCanvas.addEventListener(ev, moveDraw, { passive: false }));
  ["mouseup", "mouseleave", "touchend"].forEach((ev) => paintCanvas.addEventListener(ev, endDraw));

  document.getElementById("clearCanvas").addEventListener("click", () => paintBackground(currentBg));
  document.getElementById("downloadCanvas").addEventListener("click", () => {
    // Çizgi film katmanını ve boyanan katmanı tek bir görsele birleştir.
    const merged = document.createElement("canvas");
    merged.width = paintCanvas.width;
    merged.height = paintCanvas.height;
    const mctx = merged.getContext("2d");
    mctx.drawImage(paintCanvas, 0, 0);
    mctx.drawImage(lineCanvas, 0, 0);

    const link = document.createElement("a");
    link.download = "manifest-kartim.png";
    link.href = merged.toDataURL("image/png");
    link.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSite("atolye");
  initPaint();
});
