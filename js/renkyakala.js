(function(){
  const HOLE_COUNT = 12;
  const ROUND_SECONDS = 30;
  const SPAWN_MS = 700;
  const LIFETIME_MS = 850;
  const TARGET_SWITCH_MS = 10000;

  function initRenkYakala(){
    const grid = document.getElementById("renkGrid");
    const statEl = document.getElementById("renkStat");
    const targetEl = document.getElementById("renkTarget");
    const winMsg = document.getElementById("renkWin");
    const startBtn = document.getElementById("renkStart");
    if(!grid || !statEl || !targetEl || !winMsg || !startBtn) return;

    let score = 0, timeLeft = ROUND_SECONDS, target = null, running = false;
    let spawnTimer = null, countdownTimer = null, targetTimer = null;
    let activeHole = null, hideTimer = null;

    /* delikleri bir kez oluştur */
    for(let i = 0; i < HOLE_COUNT; i++){
      const hole = document.createElement("button");
      hole.type = "button";
      hole.className = "renk-hole";
      hole.setAttribute("aria-label", `Delik ${i + 1}`);
      hole.addEventListener("click", () => handleHoleClick(hole));
      grid.appendChild(hole);
    }

    function pickTarget(){
      target = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
      targetEl.textContent = `${target.colorTr} ${target.emoji}`;
      targetEl.style.color = target.hex;
    }

    function updateStat(){
      statEl.textContent = `Skor: ${score} · Süre: 0:${String(timeLeft).padStart(2, "0")}`;
    }

    function clearHole(){
      if(activeHole){
        activeHole.classList.remove("active");
        activeHole.style.background = "";
        delete activeHole.dataset.key;
        activeHole = null;
      }
      clearTimeout(hideTimer);
    }

    function spawnDot(){
      clearHole();
      const holes = grid.querySelectorAll(".renk-hole");
      const hole = holes[Math.floor(Math.random() * holes.length)];
      const member = MEMBERS[Math.floor(Math.random() * MEMBERS.length)];
      hole.classList.add("active");
      hole.style.background = member.hex;
      hole.dataset.key = member.key;
      activeHole = hole;
      hideTimer = setTimeout(clearHole, LIFETIME_MS);
    }

    function handleHoleClick(hole){
      if(!running || !hole.classList.contains("active")) return;
      if(hole.dataset.key === target.key){
        score++;
        updateStat();
        if(typeof playDing === "function") playDing();
        if(typeof launchSparkleBurst === "function"){
          const rect = hole.getBoundingClientRect();
          launchSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      } else {
        hole.classList.add("wrong");
        setTimeout(() => hole.classList.remove("wrong"), 300);
      }
      clearHole();
    }

    function startGame(){
      score = 0;
      timeLeft = ROUND_SECONDS;
      running = true;
      winMsg.classList.remove("show");
      clearHole();
      pickTarget();
      updateStat();
      startBtn.textContent = "Yeniden Başlat 🔄";

      clearInterval(spawnTimer);
      clearInterval(countdownTimer);
      clearInterval(targetTimer);
      spawnTimer = setInterval(spawnDot, SPAWN_MS);
      targetTimer = setInterval(pickTarget, TARGET_SWITCH_MS);
      countdownTimer = setInterval(() => {
        timeLeft--;
        updateStat();
        if(timeLeft <= 0) endGame();
      }, 1000);
    }

    function endGame(){
      running = false;
      clearInterval(spawnTimer);
      clearInterval(countdownTimer);
      clearInterval(targetTimer);
      clearHole();
      winMsg.textContent = `Süre bitti! Skor: ${score} 🎯`;
      winMsg.classList.add("show");
      if(score >= 10 && typeof launchConfetti === "function") launchConfetti();
    }

    startBtn.addEventListener("click", startGame);
    updateStat();
  }

  document.addEventListener("DOMContentLoaded", initRenkYakala);
})();
