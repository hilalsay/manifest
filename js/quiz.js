let qIndex = 0;
const tally = [0,0,0,0,0,0];

function renderProgress(){
  const quizProgress = document.getElementById("quizProgress");
  if(!quizProgress) return;
  quizProgress.innerHTML = "";
  QUESTIONS.forEach((_, i) => {
    const bar = document.createElement("i");
    if(i < qIndex) bar.classList.add("done");
    quizProgress.appendChild(bar);
  });
}

function renderQuestion(){
  renderProgress();
  const cur = QUESTIONS[qIndex];
  document.getElementById("qTitle").textContent = `${qIndex + 1}. ${cur.q}`;
  const qOptions = document.getElementById("qOptions");
  qOptions.innerHTML = "";
  cur.opts.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "q-option";
    b.textContent = opt;
    b.addEventListener("click", () => {
      tally[i]++;
      qIndex++;
      if(qIndex < QUESTIONS.length) renderQuestion();
      else showResult();
    });
    qOptions.appendChild(b);
  });
}

function showResult(){
  document.getElementById("quizBody").classList.add("hide");
  document.getElementById("quizResult").classList.add("show");
  let best = 0;
  for(let i = 1; i < tally.length; i++){
    if(tally[i] > tally[best]) best = i;
  }
  const m = MEMBERS[best];
  document.getElementById("resultBadge").style.background = m.hex;
  document.getElementById("resultBadge").textContent = m.emoji;
  document.getElementById("resultTitle").textContent = `Sen tam olarak ${m.name} gibisin!`;
  document.getElementById("resultFact").textContent = `${m.fact} Senin rengin: ${m.colorTr} ${m.emoji}`;
  launchConfetti();
}

document.addEventListener("DOMContentLoaded", () => {
  initSite("test");
  document.getElementById("retakeBtn").addEventListener("click", () => {
    qIndex = 0;
    for(let i = 0; i < tally.length; i++) tally[i] = 0;
    document.getElementById("quizResult").classList.remove("show");
    document.getElementById("quizBody").classList.remove("hide");
    renderQuestion();
  });
  renderQuestion();
});
