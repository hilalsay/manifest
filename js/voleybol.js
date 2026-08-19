const canvas = document.getElementById("vballCanvas");
const ctx = canvas.getContext("2d");

const FLOOR_Y = 290;
const NET_X = 240;
const GRAVITY = 0.09;
const MAX_VY = 7;
const MAX_VX = 3.5;

let running = false;
let score = 0;
let lastTime = 0;

const ball = { x: 240, y: 80, vx: 0.8, vy: 0, r: 16 };
const paddle = { x: 240, w: 90, h: 14, y: FLOOR_Y - 18 };

function resetGame(){
  ball.x = canvas.width / 2;
  ball.y = 70;
  ball.vx = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.4);
  ball.vy = -1;
  paddle.x = canvas.width / 2;
  score = 0;
  running = true;
  document.getElementById("vballScore").textContent = "Skor: 0";
  document.getElementById("vballHint").textContent = "Parmağını veya fareni hareket ettir — topu yere düşürme!";
}

function drawCourt(){
  const w = canvas.width, h = canvas.height;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#6EC6FF");
  sky.addColorStop(1, "#B8E6FF");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#F4D9A0";
  ctx.fillRect(0, FLOOR_Y, NET_X, h - FLOOR_Y);
  ctx.fillStyle = "#A8D4F0";
  ctx.fillRect(NET_X, FLOOR_Y, w - NET_X, h - FLOOR_Y);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(NET_X, FLOOR_Y);
  ctx.lineTo(NET_X, FLOOR_Y - 70);
  ctx.stroke();
  for(let i = 0; i < 6; i++){
    const yy = FLOOR_Y - 10 - i * 12;
    ctx.beginPath();
    ctx.moveTo(NET_X - 4, yy);
    ctx.lineTo(NET_X + 4, yy);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  ctx.lineTo(w, FLOOR_Y);
  ctx.stroke();
}

function drawBall(){
  const grad = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 1, ball.x, ball.y, ball.r);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(0.5, "#FF5FA8");
  grad.addColorStop(1, "#FF4757");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPaddle(){
  ctx.fillStyle = "rgba(27,18,51,0.75)";
  ctx.beginPath();
  ctx.roundRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h, 7);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function update(dt){
  if(!running) return;

  ball.vy += GRAVITY * dt;
  ball.vy = Math.max(-MAX_VY, Math.min(MAX_VY, ball.vy));
  ball.vx = Math.max(-MAX_VX, Math.min(MAX_VX, ball.vx));
  ball.vx *= 0.999;

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if(ball.x - ball.r < 8){
    ball.x = 8 + ball.r;
    ball.vx = Math.abs(ball.vx) * 0.6;
  }
  if(ball.x + ball.r > canvas.width - 8){
    ball.x = canvas.width - 8 - ball.r;
    ball.vx = -Math.abs(ball.vx) * 0.6;
  }

  if(ball.y - ball.r < 8){
    ball.y = 8 + ball.r;
    ball.vy = Math.abs(ball.vy) * 0.5;
  }

  const px = paddle.x, py = paddle.y;
  if(ball.vy > 0 &&
     ball.y + ball.r >= py && ball.y - ball.r <= py + paddle.h + 6 &&
     ball.x >= px - paddle.w / 2 - 6 && ball.x <= px + paddle.w / 2 + 6){
    ball.y = py - ball.r;
    ball.vy = -5.5 - Math.min(score * 0.04, 1.5);
    ball.vx += (ball.x - px) * 0.04;
    score++;
    document.getElementById("vballScore").textContent = `Skor: ${score}`;
  }

  if(ball.y + ball.r > FLOOR_Y + 4){
    running = false;
    document.getElementById("vballHint").textContent = `Top düştü! Skorun: ${score} — yeniden dene 🏐`;
  }
}

function loop(ts){
  if(!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 16.67, 2);
  lastTime = ts;
  update(dt);
  drawCourt();
  drawPaddle();
  drawBall();
  if(!running && score === 0){
    ctx.fillStyle = "rgba(27,18,51,0.7)";
    ctx.font = "bold 16px 'Baloo 2', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Başlamak için tıkla!", canvas.width / 2, canvas.height / 2);
  }
  requestAnimationFrame(loop);
}

function movePaddle(clientX){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  paddle.x = Math.max(paddle.w / 2 + 8, Math.min(canvas.width - paddle.w / 2 - 8, (clientX - rect.left) * scaleX));
}

canvas.addEventListener("mousemove", e => { if(running) movePaddle(e.clientX); });
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if(running) movePaddle(e.touches[0].clientX);
}, { passive: false });
canvas.addEventListener("click", e => {
  if(!running && score >= 0) resetGame();
  movePaddle(e.clientX);
});
canvas.addEventListener("touchstart", e => {
  if(!running) resetGame();
  movePaddle(e.touches[0].clientX);
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  initSite("oyunlar");
  document.getElementById("vballReset").addEventListener("click", resetGame);
  running = false;
  score = 0;
  document.getElementById("vballHint").textContent = "Başla'ya bas veya sahaya dokun!";
  requestAnimationFrame(loop);
});
