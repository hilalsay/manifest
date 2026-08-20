(function(){
  const HOLE_COUNT = 12;
  const DEFAULT_SECONDS = 30;
  const SPAWN_MS = 700;
  const LIFETIME_MS = 850;
  const TARGET_SWITCH_MS = 10000;

  // "Torba" (bag) rastgeleliği: her öğeyi tekrar çekmeden önce tüm seti bir kez
  // dağıtır — Math.random()'ın art arda aynı sonucu (aynı renk/aynı delik)
  // vermesine göre çok daha dengeli ve gerçekten "rastgele" hissettirir.
  function makeBag(items){
    let bag = [];
    return function next(){
      if(bag.length === 0){
        bag = items.slice();
        for(let i = bag.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
      }
      return bag.pop();
    };
  }

  function initRenkYakala(){
    const grid = document.getElementById("renkGrid");
    const statEl = document.getElementById("renkStat");
    const targetEl = document.getElementById("renkTarget");
    const winMsg = document.getElementById("renkWin");
    const startBtn = document.getElementById("renkStart");
    const durationPicker = document.getElementById("renkDurationPicker");
    if(!grid || !statEl || !targetEl || !winMsg || !startBtn) return;

    let roundSeconds = DEFAULT_SECONDS;
    let score = 0, timeLeft = roundSeconds, target = null, running = false;
    let spawnTimer = null, countdownTimer = null, targetTimer = null;
    let activeHole = null, hideTimer = null;
    let nextColor = makeBag(MEMBERS);
    let nextHoleIndex = makeBag(Array.from({ length: HOLE_COUNT }, (_, i) => i));

    /* delikleri bir kez oluştur */
    const holes = [];
    for(let i = 0; i < HOLE_COUNT; i++){
      const hole = document.createElement("button");
      hole.type = "button";
      hole.className = "renk-hole";
      hole.setAttribute("aria-label", `Delik ${i + 1}`);
      hole.addEventListener("click", () => handleHoleClick(hole));
      grid.appendChild(hole);
      holes.push(hole);
    }

    /* süre seçimi — oyun başlamadan önce seçilir, çalışırken de değiştirilebilir,
       bir sonraki "Başlat"ta devreye girer */
    if(durationPicker){
      durationPicker.querySelectorAll(".song-pick").forEach((btn) => {
        btn.addEventListener("click", () => {
          roundSeconds = Number(btn.dataset.seconds) || DEFAULT_SECONDS;
          durationPicker.querySelectorAll(".song-pick").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if(!running){
            timeLeft = roundSeconds;
            updateStat();
          }
        });
      });
    }

    function pickTarget(){
      let next = nextColor();
      if(target && next.key === target.key) next = nextColor(); // aynı hedefin art arda gelmesini engelle
      target = next;
      targetEl.textContent = `${target.colorTr} ${target.emoji}`;
      targetEl.style.color = target.hex;
    }

    function updateStat(){
      const time = typeof formatTime === "function" ? formatTime(timeLeft) : `0:${String(timeLeft).padStart(2, "0")}`;
      statEl.textContent = `Skor: ${score} · Süre: ${time}`;
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
      const hole = holes[nextHoleIndex()];
      const member = nextColor();
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
      timeLeft = roundSeconds;
      running = true;
      winMsg.classList.remove("show");
      clearHole();
      nextColor = makeBag(MEMBERS);
      nextHoleIndex = makeBag(Array.from({ length: HOLE_COUNT }, (_, i) => i));
      target = null;
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
