(function(){
  const MAX_LIVES = 3;
  const BASKET_W = 56;
  const BASKET_H = 30;
  const BASKET_SPEED = 7;

  function initYildizYakala(){
    const canvas = document.getElementById("yildizCanvas");
    const statEl = document.getElementById("yildizStat");
    const resetBtn = document.getElementById("yildizReset");
    const hint = document.getElementById("yildizHint");
    if(!canvas || !statEl || !resetBtn) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const basketY = H - 28;

    let basketX = W / 2;
    const keys = { left: false, right: false };
    let stars = [];
    let score = 0, lives = MAX_LIVES, running = false, over = false;
    let spawnTimer = 0, elapsed = 0, lastTime = 0, animId = null;

    function updateStat(){
      statEl.textContent = `Skor: ${score} · Can: ${"❤️".repeat(lives)}${"🤍".repeat(MAX_LIVES - lives)}`;
    }

    function drawStar(cx, cy, r, color){
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      for(let i = 0; i < 5; i++){
        const outerAngle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
        const innerAngle = outerAngle + Math.PI / 5;
        const ox = Math.cos(outerAngle) * r, oy = Math.sin(outerAngle) * r;
        const ix = Math.cos(innerAngle) * r * 0.45, iy = Math.sin(innerAngle) * r * 0.45;
        if(i === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    function draw(){
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#241947");
      bg.addColorStop(1, "#1B1233");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      stars.forEach((s) => drawStar(s.x, s.y, s.r, s.color));

      ctx.font = `${BASKET_H + 18}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🧺", basketX, basketY);

      if(over){
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = '700 22px "Baloo 2", sans-serif';
        ctx.fillText("Oyun bitti!", W / 2, H / 2 - 14);
        ctx.font = '700 15px "Mulish", sans-serif';
        ctx.fillText(`Skor: ${score} — yeniden başlamak için dokun`, W / 2, H / 2 + 16);
      }
    }

    function spawnStar(){
      const member = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
      stars.push({
        x: Math.random() * (W - 40) + 20,
        y: -20,
        r: 13,
        speed: 1.6 + Math.random() * 1.2 + Math.min(elapsed / 20000, 1.5),
        color: member.hex,
      });
    }

    function update(dt){
      spawnTimer -= dt;
      if(spawnTimer <= 0){
        spawnStar();
        spawnTimer = Math.max(420, 1000 - elapsed / 80);
      }

      if(keys.left) basketX -= BASKET_SPEED;
      if(keys.right) basketX += BASKET_SPEED;
      basketX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, basketX));

      const catchTop = basketY - BASKET_H / 2;
      stars = stars.filter((s) => {
        s.y += s.speed;
        if(s.y >= catchTop - s.r && s.y <= H - 12 && Math.abs(s.x - basketX) <= BASKET_W / 2 + s.r * 0.4){
          score++;
          updateStat();
          return false;
        }
        if(s.y - s.r > H){
          lives--;
          updateStat();
          if(lives <= 0) endGame();
          return false;
        }
        return true;
      });
    }

    function loop(time){
      if(!running) return;
      const dt = lastTime ? time - lastTime : 16;
      lastTime = time;
      elapsed += dt;
      update(dt);
      draw();
      animId = requestAnimationFrame(loop);
    }

    function startGame(){
      score = 0;
      lives = MAX_LIVES;
      stars = [];
      over = false;
      running = true;
      basketX = W / 2;
      elapsed = 0;
      spawnTimer = 400;
      lastTime = 0;
      updateStat();
      if(animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(loop);
    }

    function endGame(){
      running = false;
      over = true;
      draw();
      if(score >= 8 && typeof launchConfetti === "function") launchConfetti();
    }

    function pointerMove(clientX){
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      basketX = (clientX - rect.left) * scaleX;
    }

    canvas.addEventListener("mousemove", (e) => { if(running) pointerMove(e.clientX); });
    canvas.addEventListener("touchmove", (e) => {
      if(running && e.touches[0]){ pointerMove(e.touches[0].clientX); e.preventDefault(); }
    }, { passive: false });
    canvas.addEventListener("click", () => { if(over) startGame(); });
    canvas.addEventListener("touchstart", () => { if(over) startGame(); });

    window.addEventListener("keydown", (e) => {
      if(e.key === "ArrowLeft") keys.left = true;
      if(e.key === "ArrowRight") keys.right = true;
    });
    window.addEventListener("keyup", (e) => {
      if(e.key === "ArrowLeft") keys.left = false;
      if(e.key === "ArrowRight") keys.right = false;
    });

    resetBtn.addEventListener("click", startGame);
    if(hint) hint.textContent = "Fareyle/parmakla ya da ok tuşlarıyla sepeti hareket ettir, düşen yıldızları yakala!";

    draw();
    startGame();
  }

  document.addEventListener("DOMContentLoaded", initYildizYakala);
})();
