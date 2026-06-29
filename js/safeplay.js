// js/safeplay.js
document.addEventListener("DOMContentLoaded", () => {
  const audioVideo = document.getElementById('audio-video');
  if (!audioVideo) return;

  // Función segura para reproducir sin reiniciar si ya está en reproducción
  window.safePlayVideo = async () => {
    try {
      if (!audioVideo.paused && !audioVideo.ended) return; // ya reproduciendo
      await audioVideo.play();
    } catch (e) {
      // play puede fallar por políticas de autoplay; lo ignoramos aquí
      console.warn('safePlayVideo: play blocked or failed', e);
    }
  };

  // Evitar que otros scripts reasignen src accidentalmente
  Object.defineProperty(audioVideo, 'safeSetSrc', {
    value: (src) => {
      if (audioVideo.src && audioVideo.src.includes(src)) return;
      audioVideo.src = src;
    },
    writable: false
  });
});
