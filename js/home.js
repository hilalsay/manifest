(function(){
  const FAV_KEY = "manifestFavMember";

  function renderFavCard(){
    const card = document.getElementById("favCard");
    const picker = document.getElementById("memberPicker");
    if(!card || !picker) return;

    const emojiEl = document.getElementById("favCardEmoji");
    const nameEl = document.getElementById("favCardName");
    const subEl = document.getElementById("favCardSub");

    function applyMember(m){
      if(m){
        card.classList.add("has-fav");
        card.style.setProperty("--fav-color", m.hex);
        emojiEl.textContent = m.emoji;
        nameEl.textContent = m.name.split(" ")[0].toUpperCase();
        subEl.textContent = `${m.role.toUpperCase()} · ${m.colorTr.toUpperCase()}`;
      } else {
        card.classList.remove("has-fav");
        card.style.removeProperty("--fav-color");
        emojiEl.textContent = "💫";
        nameEl.textContent = "MANİFEST";
        subEl.textContent = "FAN KARTI · 001";
      }
    }

    function setActiveChip(key){
      picker.querySelectorAll(".member-chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.key === (key || "all"));
      });
    }

    const allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "member-chip";
    allChip.dataset.key = "all";
    allChip.style.background = "rgba(255,255,255,0.15)";
    allChip.title = "Favori seçimini kaldır, hepsini göster";
    allChip.setAttribute("aria-label", "Favori seçimini kaldır, hepsini göster");
    allChip.textContent = "💫";
    allChip.addEventListener("click", () => {
      localStorage.removeItem(FAV_KEY);
      applyMember(null);
      setActiveChip(null);
    });
    picker.appendChild(allChip);

    MEMBERS.forEach(m => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "member-chip";
      chip.dataset.key = m.key;
      chip.style.background = m.hex;
      chip.title = `${m.name} — kartını ona göre kişiselleştir`;
      chip.setAttribute("aria-label", `Favori: ${m.name}`);
      chip.textContent = m.emoji;
      chip.addEventListener("click", () => {
        localStorage.setItem(FAV_KEY, m.key);
        applyMember(m);
        setActiveChip(m.key);
      });
      picker.appendChild(chip);
    });

    const savedKey = localStorage.getItem(FAV_KEY);
    const saved = MEMBERS.find(m => m.key === savedKey);
    applyMember(saved || null);
    setActiveChip(saved ? saved.key : null);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSite("home");
    initStars("stars");
    initSongBanner("songBanner");
    renderFavCard();
  });
})();
