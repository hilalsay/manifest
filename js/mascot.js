/* Sayfa kenarlarında dolaşan, el sallayan, tıklayınca zıplayan küçük karakter. */
(function(){
  function initMascot(){
    const img = document.getElementById("mascotImg");
    if(!img) return;

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
  }

  document.addEventListener("DOMContentLoaded", initMascot);
})();
