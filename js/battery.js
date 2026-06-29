// js/battery.js
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("battery-status");
  const levelEl = document.getElementById("battery-level");
  const timeEl = document.getElementById("battery-time");
  const refreshBtn = document.getElementById("battery-refresh");

  async function updateBattery(bat) {
    const charging = bat.charging ? "Cargando" : "No cargando";
    const pct = Math.round(bat.level * 100) + "%";
    let timeText = "Desconocido";
    if (bat.charging) {
      timeText = bat.chargingTime === Infinity ? "Desconocido" : `${Math.round(bat.chargingTime/60)} min`;
    } else {
      timeText = bat.dischargingTime === Infinity ? "Desconocido" : `${Math.round(bat.dischargingTime/60)} min`;
    }
    if (statusEl) statusEl.textContent = charging;
    if (levelEl) levelEl.textContent = pct;
    if (timeEl) timeEl.textContent = timeText;
  }

  async function initBattery() {
    if (!navigator.getBattery) {
      if (statusEl) statusEl.textContent = "API no soportada";
      return;
    }
    try {
      const bat = await navigator.getBattery();
      updateBattery(bat);
      bat.addEventListener('chargingchange', () => updateBattery(bat));
      bat.addEventListener('levelchange', () => updateBattery(bat));
      bat.addEventListener('chargingtimechange', () => updateBattery(bat));
      bat.addEventListener('dischargingtimechange', () => updateBattery(bat));
      if (refreshBtn) refreshBtn.onclick = () => updateBattery(bat);
    } catch (e) {
      console.error("Battery API error:", e);
      if (statusEl) statusEl.textContent = "Error";
    }
  }

  initBattery();
});
