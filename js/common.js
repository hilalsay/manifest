function renderNav(activeId){
  const links = NAV_ITEMS.map(item =>
    `<li><a href="${item.href}"${item.id === activeId ? ' class="active"' : ""}>${item.label}</a></li>`
  ).join("");
  document.body.insertAdjacentHTML("afterbegin", `
    <header class="nav">
      <div class="wrap">
        <a class="logo" href="/"><span class="dot"></span> Manifest Dünyam</a>
        <button class="navtoggle" id="navToggle" aria-label="Menüyü aç">☰</button>
        <nav aria-label="Ana menü">
          <ul class="navlinks" id="navLinks">${links}</ul>
        </nav>
      </div>
    </header>`);
}

function renderFooter(){
  document.body.insertAdjacentHTML("beforeend", `
    <footer>
      <button class="heart-btn" id="secretHeart" aria-label="gizli">💌</button>
      <p>Sevgiyle yapıldı · Manifest Dünyam ✨</p>
    </footer>
    <div class="secret-modal" id="secretModal">
      <div class="secret-box">
        <div class="emoji">🌟</div>
        <h3>Gizli bir mesaj buldun!</h3>
        <p>Bu senin kendi küçük dünyan. Dans et, boya yap, hayal kur — hepsi senin renginle daha güzel 💜</p>
        <button class="btn btn-dark" id="closeSecret" style="margin-top:16px;">Kapat</button>
      </div>
    </div>`);
}

function initNavToggle(){
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if(!navToggle || !navLinks) return;
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

function initStars(containerId){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  for(let i = 0; i < 40; i++){
    const s = document.createElement("div");
    const size = Math.random() * 2 + 1;
    s.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:#fff;
      left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${Math.random()*0.7+0.2};`;
    wrap.appendChild(s);
  }
}

function initSongBanner(elId){
  const el = document.getElementById(elId);
  if(!el) return;
  const daySong = SONGS[(new Date().getDate() + new Date().getMonth() * 31) % SONGS.length];
  el.innerHTML = `${daySong.emoji} Günün Şarkısı: <strong>${daySong.title}</strong> — bugün bunu dinle! 🎧`;
}

function launchSparkleBurst(originX, originY){
  const emojis = ["✨","⭐","💫","🌟","💜","💖"];
  const cx = typeof originX === "number" ? originX : window.innerWidth / 2;
  const cy = typeof originY === "number" ? originY : window.innerHeight / 2;
  for(let i = 0; i < 30; i++){
    const s = document.createElement("div");
    s.className = "sparkle-burst";
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = cx + "px";
    s.style.top = cy + "px";
    s.style.fontSize = (Math.random() * 14 + 14) + "px";
    document.body.appendChild(s);
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 220 + 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const duration = Math.random() * 500 + 700;
    s.animate([
      { transform: "translate(-50%,-50%) scale(0.3)", opacity: 0 },
      { transform: "translate(-50%,-50%) scale(1.1)", opacity: 1, offset: 0.2 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.7)`, opacity: 0 }
    ], { duration, easing: "ease-out" }).onfinish = () => s.remove();
  }
}

function launchConfetti(){
  const colors = ["#2FBF71","#9D5CFF","#FF5FA8","#3E8EFF","#FF4757","#FFC93C"];
  for(let i = 0; i < 40; i++){
    const c = document.createElement("div");
    c.className = "confetti";
    const size = Math.random() * 8 + 6;
    c.style.width = size + "px";
    c.style.height = size * 0.4 + "px";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(c);
    const duration = Math.random() * 1500 + 2000;
    c.animate([
      { transform: c.style.transform, top:"-10px" },
      { transform: `rotate(${Math.random()*720}deg)`, top:"105vh" }
    ], { duration, easing:"ease-in" }).onfinish = () => c.remove();
  }
}

function initSecretEasterEgg(){
  const secretHeart = document.getElementById("secretHeart");
  const secretModal = document.getElementById("secretModal");
  if(!secretHeart || !secretModal) return;
  document.getElementById("closeSecret").addEventListener("click", () => secretModal.classList.remove("show"));
  secretModal.addEventListener("click", e => { if(e.target === secretModal) secretModal.classList.remove("show"); });
  let heartClicks = 0;
  secretHeart.addEventListener("click", () => {
    heartClicks++;
    if(heartClicks >= 3){
      heartClicks = 0;
      secretModal.classList.add("show");
      launchConfetti();
    }
  });
}

function checkSecretEntry(){
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace("#","");
  const isSecret = params.get("gizli") === "manifest" || hash === "gizli" || params.get("fan") === "lila";
  if(!isSecret) return;
  setTimeout(() => {
    const secretModal = document.getElementById("secretModal");
    if(secretModal){
      secretModal.classList.add("show");
      launchConfetti();
      const box = document.querySelector(".secret-box p");
      if(box) box.textContent = "Gizli yolu buldun! Bu senin kendi küçük dünyan — dans et, boya yap, hayal kur. Hepsi senin renginle daha güzel 💜";
    }
  }, 600);
}

function initSite(activeId){
  renderNav(activeId);
  renderFooter();
  initNavToggle();
  initSecretEasterEgg();
  checkSecretEntry();
}

function formatTime(sec){
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2,"0")}`;
}
