export function initRitimGame() {
  const lanesRoot = document.getElementById('ritim-lanes');
  const scoreEl = document.getElementById('ritim-score');
  const statusEl = document.getElementById('ritim-status');
  const startBtn = document.getElementById('ritim-start');
  const pauseBtn = document.getElementById('ritim-pause');
  const prevBtn = document.getElementById('ritim-prev');
  const nextBtn = document.getElementById('ritim-next');
  const loopBtn = document.getElementById('ritim-loop');
  const pickerRoot = document.getElementById('ritim-song-picker');
  const nowPlayingEl = document.getElementById('ritim-now-playing');

  if (!lanesRoot || !scoreEl || !statusEl || !startBtn) return;

  const laneNames = ['Sol', 'Orta 1', 'Orta 2', 'Sağ'];
  const laneKeys = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];
  const laneColors = ['#2FBF71', '#9D5CFF', '#FF5FA8', '#3E8EFF'];
  const HIT_TOLERANCE = 52;
  const NOTE_BASE_SPEED = 120;
  const tracks = Array.isArray(TRACKS) ? TRACKS : [];
  const audio = new Audio();
  audio.preload = 'none';

  const lanes = laneColors.map((color, index) => ({
    index,
    key: laneKeys[index],
    name: laneNames[index],
    color,
    notes: [],
    element: null,
  }));

  const state = {
    running: false,
    score: 0,
    combo: 0,
    lastTime: 0,
    spawnAccumulator: 0,
    spawnInterval: 1.2,
    animationId: null,
    noteId: 0,
    trackIndex: 0,
    loop: false,
  };

  function getSelectedTrack() {
    return tracks[state.trackIndex] || tracks[0] || null;
  }

  function updateScore() {
    scoreEl.textContent = `Skor: ${state.score} · Combo: ${state.combo}`;
  }

  function clearStatus() {
    clearTimeout(statusEl._flashTimer);
    statusEl.textContent = '';
    statusEl.className = 'rhythm-status';
  }

  function setStatus(message, type = '', timeoutMs = 0) {
    if (!message) {
      clearStatus();
      return;
    }

    statusEl.textContent = message;
    statusEl.className = 'rhythm-status';
    if (type) statusEl.classList.add(type);

    if (timeoutMs > 0) {
      clearTimeout(statusEl._flashTimer);
      statusEl._flashTimer = setTimeout(() => {
        clearStatus();
      }, timeoutMs);
    }
  }

  function updateNowPlaying() {
    const track = getSelectedTrack();
    if (!nowPlayingEl) return;
    nowPlayingEl.textContent = track ? `${track.emoji} ${track.title}` : 'Şarkı seç';
  }

  function renderTrackPicker() {
    if (!pickerRoot) return;
    pickerRoot.innerHTML = '';

    tracks.forEach((track, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'song-pick';
      if (index === state.trackIndex) button.classList.add('active');
      button.textContent = `${track.emoji} ${track.title}`;
      button.addEventListener('click', () => {
        selectTrack(index);
        if (state.running) {
          startGame(true);
        }
      });
      pickerRoot.appendChild(button);
    });
  }

  function selectTrack(index) {
    if (!tracks.length) return;
    state.trackIndex = (index + tracks.length) % tracks.length;
    updateNowPlaying();
    renderTrackPicker();
    audio.src = getSelectedTrack()?.mp3 || '';
    audio.loop = state.loop;
    audio.load();
    if (getSelectedTrack() && !getSelectedTrack().mp3) {
      setStatus(`${getSelectedTrack().title} için MP3 dosyası yok.`, 'miss');
    }
  }

  function buildLanes() {
    lanesRoot.innerHTML = '';

    lanes.forEach((lane) => {
      const laneEl = document.createElement('div');
      laneEl.className = 'rhythm-lane';
      laneEl.dataset.index = String(lane.index);
      laneEl.setAttribute('role', 'button');
      laneEl.setAttribute('aria-label', `${lane.name} şeridi`);

      const target = document.createElement('div');
      target.className = 'rhythm-target';
      laneEl.appendChild(target);

      const label = document.createElement('span');
      label.className = 'ritim-lane-label';
      label.textContent = lane.name;
      laneEl.appendChild(label);

      lane.element = laneEl;
      lanesRoot.appendChild(laneEl);

      laneEl.addEventListener('pointerdown', () => registerHit(lane.index));
    });
  }

  function clearNote(noteMeta) {
    if (!noteMeta || !noteMeta.element) return;
    noteMeta.element.remove();
  }

  function resetRound() {
    state.score = 0;
    state.combo = 0;
    state.lastTime = 0;
    state.spawnAccumulator = 0;
    lanes.forEach((lane) => {
      lane.notes.forEach((note) => clearNote(note));
      lane.notes = [];
    });
    clearStatus();
    updateScore();
  }

  function spawnNote() {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const note = document.createElement('div');
    note.className = 'rhythm-note';
    note.style.background = lane.color;
    note.textContent = '✦';
    note.style.left = '50%';

    const noteMeta = {
      id: ++state.noteId,
      laneIndex: lane.index,
      y: -30,
      speed: NOTE_BASE_SPEED + Math.random() * 30,
      element: note,
      hit: false,
    };

    lane.notes.push(noteMeta);
    lane.element.appendChild(note);
  }

  function registerHit(laneIndex) {
    if (!state.running) return;

    const lane = lanes[laneIndex];
    const targetY = lane.element.clientHeight - 28;
    let closest = null;
    let closestDistance = Infinity;

    for (const note of lane.notes) {
      if (note.hit) continue;
      const distance = Math.abs(note.y - targetY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = note;
      }
    }

    if (!closest || closestDistance > HIT_TOLERANCE) {
      state.combo = 0;
      updateScore();
      setStatus('', 'miss', 1000);
      return;
    }

    closest.hit = true;
    clearNote(closest);
    lane.notes = lane.notes.filter((note) => note !== closest);

    const points = 10 + state.combo * 5;
    state.score += points;
    state.combo += 1;
    updateScore();
    setStatus('Vuruldu! ✨', 'perfect', 1000);
  }

  function updateNotes(deltaSeconds) {
    for (const lane of lanes) {
      for (const note of [...lane.notes]) {
        note.y += note.speed * deltaSeconds;
        note.element.style.top = `${note.y}px`;

        const targetY = lane.element.clientHeight - 28;
        if (note.y > targetY + 40) {
          note.hit = true;
          lane.notes = lane.notes.filter((item) => item !== note);
          clearNote(note);
          state.combo = 0;
          updateScore();
          setStatus('', 'miss', 1000);
        }
      }
    }
  }

  function gameLoop(timestamp) {
    if (!state.running) return;

    if (!state.lastTime) state.lastTime = timestamp;
    const delta = (timestamp - state.lastTime) / 1000;
    state.lastTime = timestamp;

    state.spawnAccumulator += delta;
    if (state.spawnAccumulator >= state.spawnInterval) {
      state.spawnAccumulator = 0;
      spawnNote();
    }

    updateNotes(delta);
    state.animationId = requestAnimationFrame(gameLoop);
  }

  function pauseGame() {
    state.running = false;
    if (state.animationId) cancelAnimationFrame(state.animationId);
    state.animationId = null;
    if (startBtn) startBtn.textContent = 'Başlat ▶';
    audio.pause();
    setStatus('Duraklatıldı', '', 1000);
  }

  function startGame(resetScore = true) {
    if (!tracks.length) {
      setStatus('Şarkı listesi boş.', 'miss');
      return;
    }

    const currentTrack = getSelectedTrack();

    if (!currentTrack) {
      setStatus('Önce bir şarkı seç.', 'miss');
      return;
    }

    if (resetScore) {
      resetRound();
    }

    if (audio.src && audio.src.endsWith(currentTrack.mp3 || '')) {
      audio.loop = state.loop;
      audio.play().catch(() => {
        setStatus('Tarayıcı otomatik çalmayı engelledi. Başlat’a tekrar bas.', 'miss');
      });
    } else if (currentTrack.mp3) {
      audio.src = currentTrack.mp3;
      audio.loop = state.loop;
      audio.load();
      audio.play().catch(() => {
        setStatus('Tarayıcı otomatik çalmayı engelledi. Başlat’a tekrar bas.', 'miss');
      });
    } else {
      setStatus(`${currentTrack.title} için MP3 dosyası yok.`, 'miss');
    }

    state.running = true;
    state.lastTime = 0;
    state.spawnAccumulator = 0;
    if (startBtn) startBtn.textContent = 'Dur ||';
    setStatus('Oyun başladı — ritme uy!', '', 1200);
    state.animationId = requestAnimationFrame(gameLoop);
  }

  function toggleLoop() {
    state.loop = !state.loop;
    audio.loop = state.loop;
    if (loopBtn) loopBtn.textContent = `Loop: ${state.loop ? 'Açık' : 'Kapalı'}`;
    setStatus(state.loop ? 'Loop açık.' : 'Loop kapalı.');
  }

  function goToTrack(offset) {
    const nextIndex = state.trackIndex + offset;
    selectTrack(nextIndex);
    if (state.running) {
      startGame(true);
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (state.running) pauseGame();
      else startGame(true);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => pauseGame());
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToTrack(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToTrack(1));
  }

  if (loopBtn) {
    loopBtn.addEventListener('click', toggleLoop);
    loopBtn.textContent = 'Loop: Kapalı';
  }

  document.addEventListener('keydown', (event) => {
    const laneIndex = laneKeys.indexOf(event.code);
    if (laneIndex >= 0) {
      event.preventDefault();
      registerHit(laneIndex);
    }
  });

  buildLanes();
  renderTrackPicker();
  updateNowPlaying();
  updateScore();
  clearStatus();
  if (loopBtn) loopBtn.textContent = 'Loop: Kapalı';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRitimGame);
} else {
  initRitimGame();
}

