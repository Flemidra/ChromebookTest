async function startCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const v = document.getElementById("cam-video");
    if (v) v.srcObject = stream;
  } catch (e) {
    console.log("Camera blocked or not available:", e);
  }
}
