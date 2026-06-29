// js/audio.js (minimal)
document.addEventListener("DOMContentLoaded", () => {
  const audioVideo = document.getElementById('audio-video');
  if (!audioVideo) return;
  if (audioVideo.safeSetSrc) audioVideo.safeSetSrc('assets/media/test.mp4');
  else audioVideo.src = 'assets/media/test.mp4';
  // no extra play/stop handlers — use native controls
});
