(function(){
  let moves = 0, openCells = [], matchedCount = 0, lock = false;
  let memoTimer = null, memoSeconds = 0;

  function startMemoTimer(){
    clearInterval(memoTimer);
    memoSeconds = 0;
    document.getElementById("memoStat").textContent = `Hamle: 0 · Süre: ${formatTime(0)}`;
    memoTimer = setInterval(() => {
      memoSeconds++;
      document.getElementById("memoStat").textContent = `Hamle: ${moves} · Süre: ${formatTime(memoSeconds)}`;
    }, 1000);
  }

  function stopMemoTimer(){
    clearInterval(memoTimer);
    memoTimer = null;
  }

  function buildMemoDeck(){
    const deck = [];
    MEMBERS.forEach(m => { deck.push(m); deck.push(m); });
    for(let i = deck.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function flipMemo(cell){
    if(lock || cell.classList.contains("open") || cell.classList.contains("matched")) return;
    cell.classList.add("open");
    openCells.push(cell);
    if(openCells.length === 2){
      moves++;
      document.getElementById("memoStat").textContent = `Hamle: ${moves} · Süre: ${formatTime(memoSeconds)}`;
      lock = true;
      const [a, b] = openCells;
      if(a.dataset.key === b.dataset.key){
        a.classList.add("matched");
        b.classList.add("matched");
        openCells = [];
        lock = false;
        matchedCount++;
        if(matchedCount === MEMBERS.length){
          stopMemoTimer();
          const win = document.getElementById("memoWin");
          win.textContent = `Harika iş! ${moves} hamlede, ${formatTime(memoSeconds)} sürede bitirdin 🎉`;
          win.classList.add("show");
          if(typeof launchSparkleBurst === "function"){
            const rect = win.getBoundingClientRect();
            launchSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
          if(typeof launchConfetti === "function") launchConfetti();
        }
      } else {
        setTimeout(() => {
          a.classList.remove("open");
          b.classList.remove("open");
          openCells = [];
          lock = false;
        }, 700);
      }
    }
  }

  function renderMemo(){
    moves = 0;
    openCells = [];
    matchedCount = 0;
    lock = false;
    const memoWin = document.getElementById("memoWin");
    if(memoWin) memoWin.classList.remove("show");
    startMemoTimer();
    const deck = buildMemoDeck();
    const memoGrid = document.getElementById("memoGrid");
    memoGrid.innerHTML = "";
    deck.forEach(m => {
      const cell = document.createElement("div");
      cell.className = "memo-cell";
      cell.dataset.key = m.key;
      cell.innerHTML = `
        <div class="memo-cell-inner">
          <div class="memo-face memo-back">✨</div>
          <div class="memo-face memo-front" style="--mc:${m.hex}">${m.emoji}</div>
          <button type="button" aria-label="kart"></button>
        </div>`;
      cell.querySelector("button").addEventListener("click", () => flipMemo(cell));
      memoGrid.appendChild(cell);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSite("oyunlar");
    const resetBtn = document.getElementById("memoReset");
    if(resetBtn) resetBtn.addEventListener("click", renderMemo);
    renderMemo();
  });
})();
