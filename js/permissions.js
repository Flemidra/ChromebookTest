document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const forceBtn = document.getElementById("force-permissions");
  if (!overlay || !forceBtn) return;
  forceBtn.style.display = "inline-block";
  forceBtn.onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach(t => t.stop());
      overlay.style.display = "none";
      if (typeof startMic === "function") startMic();
      if (typeof startCam === "function") startCam();
    } catch (err) {
      console.error("getUserMedia denied or failed:", err);
      overlay.style.display = "flex";
      overlay.querySelector("p").innerHTML = "No se pudo obtener permisos. Revise la configuración del navegador.";
      forceBtn.style.display = "none";
    }
  };
});
