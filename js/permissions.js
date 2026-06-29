document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const forceBtn = document.getElementById("force-permissions");
  if (!overlay || !forceBtn) return;

  // mostrar overlay hasta que el usuario permita
  overlay.style.display = "flex";

  forceBtn.onclick = async () => {
    try {
      // user gesture present because onclick
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // attach camera preview
      const cam = document.getElementById("cam-video");
      if (cam) cam.srcObject = stream;
      // stop tracks for mic preview if you don't want to keep them
      // stream.getTracks().forEach(t => { if (t.kind === 'audio') t.stop(); });
      overlay.style.display = "none";
      // iniciar funciones que usan mic/cam
      if (typeof startMic === "function") startMic();
      if (typeof startCam === "function") startCam();
    } catch (err) {
      console.error("getUserMedia denied or failed:", err);
      // mostrar mensaje útil al usuario
      overlay.querySelector("p").textContent = "No se pudo obtener permisos. Abre la configuración del sitio y permite Cámara y Micrófono.";
      // dejar overlay visible para que el usuario intente de nuevo
      overlay.style.display = "flex";
    }
  };
});
