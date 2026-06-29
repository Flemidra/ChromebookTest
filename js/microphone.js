async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    const src = ctx.createMediaStreamSource(stream);
    src.connect(analyser);
    const canvas = document.getElementById("mic-canvas");
    if (!canvas) return;
    const c = canvas.getContext("2d");
    function draw() {
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);
      c.fillStyle = "#071029";
      c.fillRect(0,0,canvas.width,canvas.height);
      c.strokeStyle = "#4f46e5";
      c.lineWidth = 2;
      c.beginPath();
      const slice = canvas.width / data.length;
      let x = 0;
      for (let i = 0; i < data.length; i++) {
        const y = (data[i] / 128) * canvas.height / 2;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        x += slice;
      }
      c.stroke();
      requestAnimationFrame(draw);
    }
    draw();
  } catch (e) {
    console.log("Mic blocked or not available:", e);
  }
}
