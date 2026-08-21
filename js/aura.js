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

  /* "Hangi AURA Kızısın?" testi — AURA_QUESTIONS'daki her seçenek sırasıyla
     AURA_MEMBERS[0..3]'e (Su · Fırtına · Doğa · Ateş) karşılık gelir. */
  let aqIndex = 0;
  const aTally = [0,0,0,0];

  function renderAuraQuizProgress(){
    const bar = document.getElementById("auraQuizProgress");
    if(!bar || typeof AURA_QUESTIONS === "undefined") return;
    bar.innerHTML = "";
    AURA_QUESTIONS.forEach((_, i) => {
      const seg = document.createElement("i");
      if(i < aqIndex) seg.classList.add("done");
      bar.appendChild(seg);
    });
  }

  function renderAuraQuestion(){
    if(typeof AURA_QUESTIONS === "undefined") return;
    renderAuraQuizProgress();
    const cur = AURA_QUESTIONS[aqIndex];
    const title = document.getElementById("aqTitle");
    const opts = document.getElementById("aqOptions");
    if(!title || !opts) return;
    title.textContent = `${aqIndex + 1}. ${cur.q}`;
    opts.innerHTML = "";
    cur.opts.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "q-option";
      b.textContent = opt;
      b.addEventListener("click", () => {
        aTally[i]++;
        aqIndex++;
        if(aqIndex < AURA_QUESTIONS.length) renderAuraQuestion();
        else showAuraResult();
      });
      opts.appendChild(b);
    });
  }

  function showAuraResult(){
    const body = document.getElementById("aqBody");
    const result = document.getElementById("aqResult");
    if(!body || !result) return;
    body.classList.add("hide");
    result.classList.add("show");
    let best = 0;
    for(let i = 1; i < aTally.length; i++){
      if(aTally[i] > aTally[best]) best = i;
    }
    const m = AURA_MEMBERS[best];
    const badge = document.getElementById("aqBadge");
    badge.style.background = m.hex;
    badge.textContent = m.emoji;
    document.getElementById("aqTitleResult").textContent = `Sen tam olarak ${m.name} gibisin!`;
    document.getElementById("aqFact").textContent = `${m.role} — ${m.fact}`;
    if(typeof launchConfetti === "function") launchConfetti();
  }

  function initAuraQuiz(){
    if(typeof AURA_QUESTIONS === "undefined") return;
    const retakeBtn = document.getElementById("aqRetake");
    if(retakeBtn){
      retakeBtn.addEventListener("click", () => {
        aqIndex = 0;
        for(let i = 0; i < aTally.length; i++) aTally[i] = 0;
        document.getElementById("aqResult").classList.remove("show");
        document.getElementById("aqBody").classList.remove("hide");
        renderAuraQuestion();
      });
    }
    renderAuraQuestion();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSite("aura");
    renderAuraMembers();
    renderAuraSongs();
    initAuraQuiz();
  });
})();
