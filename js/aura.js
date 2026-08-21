(function(){
  function renderAuraMembers(){
    const grid = document.getElementById("auraGrid");
    if(!grid) return;
    AURA_MEMBERS.forEach(m => {
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
      el.addEventListener("click", () => el.classList.toggle("flipped"));
      grid.appendChild(el);
    });
  }

  function renderAuraSongs(){
    const list = document.getElementById("auraSongs");
    if(!list || typeof AURA_SONGS === "undefined") return;
    AURA_SONGS.forEach(s => {
      const chip = document.createElement("span");
      chip.className = "song-pick";
      chip.style.cursor = "default";
      chip.textContent = s.note ? `${s.emoji} ${s.title} — ${s.note}` : `${s.emoji} ${s.title}`;
      list.appendChild(chip);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSite("aura");
    renderAuraMembers();
    renderAuraSongs();
  });
})();
