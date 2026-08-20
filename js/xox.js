(function(){
  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  const DEFAULT_X_COLOR = "#2FBF71"; // --sueda
  const DEFAULT_O_COLOR = "#9D5CFF"; // --hilal

  function initXox(){
    const grid = document.getElementById("xoxGrid");
    const stat = document.getElementById("xoxStat");
    const winMsg = document.getElementById("xoxWin");
    const nameXInput = document.getElementById("xoxNameX");
    const nameOInput = document.getElementById("xoxNameO");
    const pickX = document.getElementById("xoxPickX");
    const pickO = document.getElementById("xoxPickO");
    if(!grid || !stat || !winMsg) return;

    const playerX = { name: "", color: DEFAULT_X_COLOR };
    const playerO = { name: "", color: DEFAULT_O_COLOR };
    let board = [];
    let turn = "X";
    let over = false;

    function displayName(p, fallback){
      return (p.name || "").trim() || fallback;
    }

    function currentPlayer(){ return turn === "X" ? playerX : playerO; }

    function updateStat(){
      const p = currentPlayer();
      const fallback = turn === "X" ? "Oyuncu 1" : "Oyuncu 2";
      stat.textContent = `Sıra: ${displayName(p, fallback)} (${turn})`;
    }

    /* hazır isim çipleri — tıklanınca hem ismi hem de rengi doldurur */
    function buildPicker(container, input, player, fallback){
      if(!container) return;
      MEMBERS.forEach((m) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.textContent = m.name.split(" ")[0];
        chip.addEventListener("click", () => {
          input.value = m.name.split(" ")[0];
          player.name = input.value;
          player.color = m.hex;
          container.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
          chip.classList.add("active");
          updateStat();
        });
        container.appendChild(chip);
      });
      input.addEventListener("input", () => {
        player.name = input.value;
        container.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        updateStat();
      });
    }
    buildPicker(pickX, nameXInput, playerX, "Oyuncu 1");
    buildPicker(pickO, nameOInput, playerO, "Oyuncu 2");

    function checkWin(){
      return WIN_LINES.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || null;
    }

    function handleClick(i, cell){
      if(over || board[i]) return;
      const p = currentPlayer();
      board[i] = turn;
      cell.textContent = turn;
      cell.style.color = p.color;
      cell.classList.add("filled");

      const line = checkWin();
      if(line){
        over = true;
        line.forEach(idx => grid.children[idx].classList.add("win"));
        const fallback = turn === "X" ? "Oyuncu 1" : "Oyuncu 2";
        winMsg.textContent = `${displayName(p, fallback)} (${turn}) kazandı! 🎉`;
        winMsg.classList.add("show");
        if(typeof launchSparkleBurst === "function"){
          const rect = winMsg.getBoundingClientRect();
          launchSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        if(typeof launchConfetti === "function") launchConfetti();
        return;
      }
      if(board.every(Boolean)){
        over = true;
        winMsg.textContent = "Berabere! 🤝";
        winMsg.classList.add("show");
        return;
      }
      turn = turn === "X" ? "O" : "X";
      updateStat();
    }

    function reset(){
      board = Array(9).fill(null);
      turn = "X";
      over = false;
      winMsg.classList.remove("show");
      winMsg.textContent = "";
      grid.innerHTML = "";
      for(let i = 0; i < 9; i++){
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "xox-cell";
        cell.setAttribute("aria-label", `Hücre ${i + 1}`);
        cell.addEventListener("click", () => handleClick(i, cell));
        grid.appendChild(cell);
      }
      updateStat();
    }

    const resetBtn = document.getElementById("xoxReset");
    if(resetBtn) resetBtn.addEventListener("click", reset);
    reset();
  }

  document.addEventListener("DOMContentLoaded", initXox);
})();
