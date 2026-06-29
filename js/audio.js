document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("audio-video");
  if (video) video.src = "assets/media/test.mp4";
  const play = document.getElementById("audio-play");
  const stop = document.getElementById("audio-stop");
  if (play) play.onclick = async () => { try { await video.play(); } catch(e){ console.warn(e); } };
  if (stop) stop.onclick = () => { if (video) { video.pause(); video.currentTime = 0; } };
});
