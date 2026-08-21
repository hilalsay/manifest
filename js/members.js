(function(){
  function renderMembers(){
    const grid = document.getElementById("membersGrid");
    if(!grid) return;
    MEMBERS.forEach(m => {
      const el = document.createElement("div");
      el.className = "card3d";
      el.innerHTML = `
        <div class="card3d-inner">
          <div class="face face-front" style="--m-color:${m.hex}">
            <span class="taphint">DOKUN ↻</span>
            <span class="initial">${m.emoji}</span>
            <span class="name">${m.name}</span>
            <span class="role">${m.role}</span>
          </div>
          <div class="face face-back" style="--m-color:${m.hex}">
            <span class="chip" style="background:${m.hex}">${m.role}</span>
            <span class="name2">${m.name}</span>
            <p class="fact">${m.fact}</p>
          </div>
        </div>`;
      el.addEventListener("click", (e) => {
        const wasFlipped = el.classList.contains("flipped");
        el.classList.toggle("flipped");
        if(!wasFlipped){
          if(typeof launchSparkleBurst === "function") launchSparkleBurst(e.clientX, e.clientY);
          if(typeof playDing === "function") playDing();
        }
      });
      grid.appendChild(el);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSite("kizlar");
    renderMembers();
  });
})();
