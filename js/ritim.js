const RHYTHM_COLORS = ["#2FBF71","#9D5CFF","#FF5FA8","#3E8EFF"];
const RHYTHM_KEYS = ["ArrowLeft","ArrowDown","ArrowUp","ArrowRight"];
const FALL_TIME = 1.75;
const HIT_WINDOW = 0.22;

let selectedTrack = TRACKS[0];
let ytPlayer = null;
let audioEl = null;
let useMp3 = false;
let rhythmActive = false;
let rhythmScore = 0;
let rhythmCombo = 0;
let lastSpawnedBeat = -1;
let activeNotes = [];
let lanes = [];
let laneHeight = 200;
let hitY = 0;
let animFrame = null;

function getSongTime(){
  if(useMp3 && audioEl) return audioEl.currentTime;
  if(ytPlayer && typeof ytPlayer.getCurrentTime === "function") return ytPlayer.getCurrentTime();
  return 0;
}

function beatInterval(){ return 60 / selectedTrack.bpm; }

function buildLanes(){
  const wrap = document.getElementById("rhythmLanes");
  wrap.innerHTML = "";
  lanes = RHYTHM_COLORS.map((color, i) => {
    const el = document.createElement("div");
    el.className = "rhythm-lane";
    el.innerHTML = `<div class="rhythm-target"></div>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Şerit ${i + 1}`);
    btn.addEventListener("click", () => hitLane(i));
    el.appendChild(btn);
    wrap.appendChild(el);
    return { el, color, i };
  });
  laneHeight = lanes[0]?.el.clientHeight || 200;
  hitY = laneHeight - 46;
}

function spawnNote(beatIndex){
  const laneIdx = beatIndex % 4;
  const lane = lanes[laneIdx];
  const hitTime = selectedTrack.startAt + beatIndex * beatInterval();
  const note = document.createElement("div");
  note.className = "rhythm-note";
  note.style.background = lane.color;
  note.textContent = "💃";
  note.style.top = "-40px";
  lane.el.appendChild(note);
  activeNotes.push({ laneIdx, lane, note, hitTime, hit: false });
}

function updateNotePositions(songTime){
  activeNotes.forEach(n => {
    if(n.hit) return;
    const timeUntil = n.hitTime - songTime;
    const progress = 1 - timeUntil / FALL_TIME;
    const y = -40 + progress * (hitY + 40);
    n.note.style.top = `${y}px`;
    if(timeUntil < -HIT_WINDOW && !n.hit){
      n.hit = true;
      n.note.remove();
      rhythmCombo = 0;
      flashLane(n.laneIdx, "miss");
      setStatus("Kaçırdın!", "miss");
      updateScoreUI();
    }
  });
  activeNotes = activeNotes.filter(n => n.note.isConnected);
}

function spawnBeats(songTime){
  const currentBeat = Math.floor((songTime - selectedTrack.startAt) / beatInterval());
  const lookAhead = Math.ceil(FALL_TIME / beatInterval()) + 1;
  for(let b = lastSpawnedBeat + 1; b <= currentBeat + lookAhead; b++){
    if(b < 0) continue;
    lastSpawnedBeat = b;
    spawnNote(b);
  }
}

function hitLane(idx){
  if(!rhythmActive) return;
  const songTime = getSongTime();
  let best = null;
  let bestDiff = Infinity;
  activeNotes.forEach(n => {
    if(n.laneIdx !== idx || n.hit) return;
    const diff = Math.abs(songTime - n.hitTime);
    if(diff < bestDiff){ bestDiff = diff; best = n; }
  });
  if(!best || bestDiff > HIT_WINDOW){
    rhythmCombo = 0;
    flashLane(idx, "miss");
    setStatus("Erken veya geç!", "miss");
    updateScoreUI();
    return;
  }
  best.hit = true;
  best.note.remove();
  if(bestDiff < 0.1){
    rhythmScore += 20 + rhythmCombo * 2;
    rhythmCombo++;
    flashLane(idx, "perfect");
    setStatus("Mükemmel! ✨", "perfect");
  } else {
    rhythmScore += 10 + rhythmCombo;
    rhythmCombo++;
    flashLane(idx, "perfect");
    setStatus("Güzel! 💃", "perfect");
  }
  updateScoreUI();
}

function flashLane(idx, type){
  const lane = lanes[idx].el;
  lane.classList.remove("hit","perfect","miss");
  lane.classList.add(type === "perfect" ? "perfect" : "miss");
  setTimeout(() => lane.classList.remove("hit","perfect","miss"), 200);
}

function setStatus(msg, cls){
  const el = document.getElementById("rhythmStatus");
  el.textContent = msg;
  el.className = "rhythm-status " + (cls || "");
}

function updateScoreUI(){
  document.getElementById("rhythmScore").textContent = `Skor: ${rhythmScore} · Combo: ${rhythmCombo}`;
}

function stopAudio(){
  if(audioEl){ audioEl.pause(); audioEl.currentTime = 0; }
  if(ytPlayer && typeof ytPlayer.stopVideo === "function") ytPlayer.stopVideo();
}

async function startAudio(){
  useMp3 = false;
  if(selectedTrack.mp3){
    try {
      audioEl = new Audio(selectedTrack.mp3);
      await audioEl.play();
      useMp3 = true;
      return;
    } catch(e){ /* YouTube'a düş */ }
  }
  if(!ytPlayer){
    setStatus("YouTube yükleniyor…");
    return false;
  }
  ytPlayer.loadVideoById({
    videoId: selectedTrack.youtubeId,
    startSeconds: selectedTrack.startAt
  });
  ytPlayer.playVideo();
  return true;
}

function startRhythm(){
  rhythmActive = true;
  rhythmScore = 0;
  rhythmCombo = 0;
  lastSpawnedBeat = -1;
  activeNotes = [];
  lanes.forEach(l => l.el.querySelectorAll(".rhythm-note").forEach(n => n.remove()));
  updateScoreUI();
  setStatus("Müzik başlıyor — ritme uy!");
  startAudio();
  document.getElementById("rhythmStart").textContent = "Dur ⏸";
}

function stopRhythm(){
  rhythmActive = false;
  stopAudio();
  activeNotes.forEach(n => n.note.remove());
  activeNotes = [];
  document.getElementById("rhythmStart").textContent = "Başla ▶";
  setStatus("Durdu.");
}

function rhythmLoop(){
  if(rhythmActive){
    const t = getSongTime();
    spawnBeats(t);
    updateNotePositions(t);
    if(useMp3 && audioEl && audioEl.ended) stopRhythm();
    if(!useMp3 && ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.ENDED) stopRhythm();
  }
  animFrame = requestAnimationFrame(rhythmLoop);
}

function buildSongPicker(){
  const picker = document.getElementById("songPicker");
  TRACKS.forEach((track, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "song-pick" + (i === 0 ? " active" : "");
    btn.textContent = `${track.emoji} ${track.title}`;
    btn.addEventListener("click", () => {
      if(rhythmActive) stopRhythm();
      selectedTrack = track;
      picker.querySelectorAll(".song-pick").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if(ytPlayer && !track.mp3){
        ytPlayer.cueVideoById({ videoId: track.youtubeId, startSeconds: track.startAt });
      }
    });
    picker.appendChild(btn);
  });
}

window.onYouTubeIframeAPIReady = function(){
  ytPlayer = new YT.Player("ytPlayer", {
    height: "100%",
    width: "100%",
    videoId: selectedTrack.youtubeId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initSite("oyunlar");
  buildLanes();
  buildSongPicker();
  document.getElementById("rhythmStart").addEventListener("click", () => {
    rhythmActive ? stopRhythm() : startRhythm();
  });
  document.addEventListener("keydown", e => {
    const idx = RHYTHM_KEYS.indexOf(e.code);
    if(idx >= 0){ e.preventDefault(); hitLane(idx); }
  });
  window.addEventListener("resize", () => {
    buildLanes();
  });
  requestAnimationFrame(rhythmLoop);

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
});
