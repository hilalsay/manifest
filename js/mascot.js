/* Sayfa kenarlarında dolaşan, el sallayan, tıklayınca zıplayan küçük karakter.
   Üst/alt kenarda yatay yatarak kayar, sağ/sol kenarda dik (ayakları üzerinde)
   yürür — hiçbir kenarda "kafası üzerinde" durmaz. */
(function(){
  const CYCLE_MS = 26000;
  const EDGE_GAP = 6; // kenara tam yapışmasın diye küçük bir boşluk

  function initMascot(){
    const mascot = document.getElementById("songMascot");
    const rotateEl = document.getElementById("mascotRotate");
    const img = document.getElementById("mascotImg");
    if(!mascot || !rotateEl || !img) return;

    /* dik (ayakta) haldeki doğal ölçüler; yatay durumda genişlik/yükseklik yer değiştirir */
    function sizes(){
      const small = window.innerWidth <= 640;
      const upW = small ? 56 : 76, upH = small ? 103 : 140;
      return { upW, upH, sideW: upH, sideH: upW };
    }

    function place(x, y, w, h, rotateDeg){
      mascot.style.width = w + "px";
      mascot.style.height = h + "px";
      mascot.style.transform = `translate(${x}px, ${y}px)`;
      rotateEl.style.transform = `rotate(${rotateDeg}deg)`;
    }

    img.addEventListener("click", () => {
      if(img.classList.contains("jumping")) return;
      img.classList.add("jumping");
      if(typeof launchSparkleBurst === "function"){
        const rect = img.getBoundingClientRect();
        launchSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });

    img.addEventListener("animationend", (e) => {
      if(e.animationName === "mascotJump") img.classList.remove("jumping");
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion){
      const { upW, upH } = sizes();
      rotateEl.style.width = upW + "px";
      rotateEl.style.height = upH + "px";
      rotateEl.style.margin = `${-upH / 2}px 0 0 ${-upW / 2}px`;
      place(EDGE_GAP, EDGE_GAP, upW, upH, 0);
      return; // sürekli dolaşma animasyonu yok
    }

    function frame(now){
      const { upW, upH, sideW, sideH } = sizes();
      rotateEl.style.width = upW + "px";
      rotateEl.style.height = upH + "px";
      rotateEl.style.margin = `${-upH / 2}px 0 0 ${-upW / 2}px`;

      const vw = window.innerWidth, vh = window.innerHeight;
      const t = (now % CYCLE_MS) / CYCLE_MS; // 0..1 tam tur
      const seg = Math.min(3, Math.floor(t * 4)); // 0:üst 1:sağ 2:alt 3:sol
      const segT = t * 4 - seg; // segment içi ilerleme 0..1

      if(seg === 0){ // üst kenar — yatay, soldan sağa
        const travel = Math.max(0, vw - sideW - EDGE_GAP * 2);
        place(EDGE_GAP + travel * segT, EDGE_GAP, sideW, sideH, 90);
      } else if(seg === 1){ // sağ kenar — dik, yukarıdan aşağı
        const travel = Math.max(0, vh - upH - EDGE_GAP * 2);
        place(vw - upW - EDGE_GAP, EDGE_GAP + travel * segT, upW, upH, 0);
      } else if(seg === 2){ // alt kenar — yatay, sağdan sola
        const travel = Math.max(0, vw - sideW - EDGE_GAP * 2);
        place(EDGE_GAP + travel * (1 - segT), vh - sideH - EDGE_GAP, sideW, sideH, 90);
      } else { // sol kenar — dik, aşağıdan yukarı
        const travel = Math.max(0, vh - upH - EDGE_GAP * 2);
        place(EDGE_GAP, EDGE_GAP + travel * (1 - segT), upW, upH, 0);
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener("DOMContentLoaded", initMascot);
})();
