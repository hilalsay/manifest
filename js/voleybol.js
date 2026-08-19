export function initVoleybolGame() {
  const canvas = document.getElementById('voleybol-canvas');
  const scoreEl = document.getElementById('voleybol-score');
  const resetBtn = document.getElementById('voleybol-reset');

  if (!canvas || !scoreEl || !resetBtn) return;

  const ctx = canvas.getContext('2d');
  const ball = {
    x: canvas.width / 2,
    y: 40,
    radius: 18,
    vx: 0,
    vy: 0,
    gravity: 0.30,
  };

  let score = 0;
  let running = false;
  let animationId = null;

  function updateScore() {
    scoreEl.textContent = `Skor: ${score}`;
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = 40;
    ball.vx = (Math.random() * 2 - 1) * 2.8;
    ball.vy = 0.6;
  }

  function resetGame() {
    score = 0;
    running = true;
    resetBall();
    updateScore();
    canvas.dataset.gameOver = 'false';
    resetBtn.disabled = false;
    resetBtn.textContent = 'Yeniden Başla';
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function setGameOver() {
    running = false;
    canvas.dataset.gameOver = 'true';
    const hint = document.getElementById('voleybol-hint');
    if (hint) {
      hint.textContent = 'Top düştü! Yeniden başla';
    }
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
    resetBtn.disabled = false;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#dff6ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(27,18,51,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 30);
    ctx.lineTo(canvas.width, canvas.height - 30);
    ctx.stroke();

    const grad = ctx.createRadialGradient(
      ball.x - 4,
      ball.y - 6,
      4,
      ball.x,
      ball.y,
      ball.radius
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#ffd1e8');
    grad.addColorStop(1, '#ff5fa8');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (canvas.dataset.gameOver === 'true') {
      ctx.fillStyle = 'rgba(27,18,51,0.75)';
      ctx.font = '700 26px "Baloo 2", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Top düştü! Yeniden başla', canvas.width / 2, canvas.height / 2);
    }
  }

  function update() {
    if (!running) return;

    ball.vy += ball.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx) * 0.85;
    }

    if (ball.x + ball.radius >= canvas.width) {
      ball.x = canvas.width - ball.radius;
      ball.vx = -Math.abs(ball.vx) * 0.85;
    }

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy) * 0.75;
    }

    if (ball.y + ball.radius >= canvas.height - 30) {
      setGameOver();
      return;
    }
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  function tryBounce(clientX, clientY) {
    if (!running) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pointX = (clientX - rect.left) * scaleX;
    const pointY = (clientY - rect.top) * scaleY;

    const distance = Math.hypot(pointX - ball.x, pointY - ball.y);
    if (distance <= ball.radius) {
      ball.vy = -Math.abs(ball.vy) * 0.9 - 4.5;
      ball.vx += (Math.random() - 0.5) * 3.5;
      score += 1;
      updateScore();
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (!running) {
      if (canvas.dataset.gameOver === 'true') {
        resetGame();
      }
      return;
    }
    tryBounce(event.clientX, event.clientY);
  });

  canvas.addEventListener('touchstart', (event) => {
    if (!running) {
      if (canvas.dataset.gameOver === 'true') {
        resetGame();
      }
      return;
    }
    const touch = event.touches[0];
    if (touch) tryBounce(touch.clientX, touch.clientY);
    event.preventDefault();
  }, { passive: false });

  resetBtn.addEventListener('click', () => {
    resetGame();
  });

  const hint = document.getElementById('voleybol-hint');
  if (hint) {
    hint.textContent = 'Sahaya tıkla veya dokun — topu yakala!';
  }

  canvas.dataset.gameOver = 'false';
  resetBall();
  draw();
  resetGame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVoleybolGame);
} else {
  initVoleybolGame();
}

