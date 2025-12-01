const audio = document.querySelector("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 260;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let audioContext, analyser, dataArray;

function startVisualizer() {
  if (!audioContext) {
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audio);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    draw();
  } else if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#000"; // black background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / dataArray.length) * 2.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 40}, 50, 180)`; // purple-blue bars
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// Start visualizer after first play
audio.addEventListener("play", startVisualizer);
