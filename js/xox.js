(function(){
  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  function initXox(){
    const grid = document.getElementById("xoxGrid");
    const stat = document.getElementById("xoxStat");
    const winMsg = document.getElementById("xoxWin");
    if(!grid || !stat || !winMsg) return;

    const playerX = MEMBERS[0]; // Sueda · yeşil
    const playerO = MEMBERS[1]; // Hilal · mor
    let board = [];
    let turn = "X";
    let over = false;

    function currentPlayer(){ return turn === "X" ? playerX : playerO; }

    function updateStat(){
      const p = currentPlayer();
      stat.textContent = `Sıra: ${p.name.split(" ")[0]} (${turn}) ${p.emoji}`;
    }

    function checkWin(){
      return WIN_LINES.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || null;
    }

    function handleClick(i, cell){
      if(over || board[i]) return;
      const p = currentPlayer();
      board[i] = turn;
      cell.textContent = turn;
      cell.style.color = p.hex;
      cell.classList.add("filled");

      const line = checkWin();
      if(line){
        over = true;
        line.forEach(idx => grid.children[idx].classList.add("win"));
        winMsg.textContent = `${p.name.split(" ")[0]} (${turn}) kazandı! 🎉`;
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
