function initPaint(){
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  const toolbar = document.getElementById("paintToolbar");
  const brushSize = document.getElementById("brushSize");
  const PALETTE = ["#1B1233","#2FBF71","#9D5CFF","#FF5FA8","#3E8EFF","#FF4757","#FFC93C","#ffffff"];
  let currentColor = PALETTE[0];
  let drawing = false;

  function drawTemplate(){
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(27,18,51,0.08)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(40, 30, canvas.width - 80, canvas.height - 60);
    ctx.setLineDash([]);
    ctx.font = "800 22px 'Baloo 2', sans-serif";
    ctx.fillStyle = "rgba(27,18,51,0.12)";
    ctx.textAlign = "center";
    ctx.fillText("MANİFEST KARTIM", canvas.width / 2, 58);
  }

  drawTemplate();

  PALETTE.forEach((c, i) => {
    const s = document.createElement("button");
    s.type = "button";
    s.className = "swatch" + (i === 0 ? " active" : "");
    s.style.background = c;
    s.addEventListener("click", () => {
      currentColor = c;
      toolbar.querySelectorAll(".swatch").forEach(el => el.classList.remove("active"));
      s.classList.add("active");
    });
    toolbar.appendChild(s);
  });

  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function startDraw(e){
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }

  function moveDraw(e){
    if(!drawing) return;
    const p = getPos(e);
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }

  function endDraw(){ drawing = false; }

  ["mousedown","touchstart"].forEach(ev => canvas.addEventListener(ev, startDraw));
  ["mousemove","touchmove"].forEach(ev => canvas.addEventListener(ev, moveDraw, { passive: false }));
  ["mouseup","mouseleave","touchend"].forEach(ev => canvas.addEventListener(ev, endDraw));

  document.getElementById("clearCanvas").addEventListener("click", drawTemplate);
  document.getElementById("downloadCanvas").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "manifest-kartim.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSite("atolye");
  initPaint();
});
