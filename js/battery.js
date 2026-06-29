// js/battery.js
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("battery-status");
  const levelEl = document.getElementById("battery-level");
  const timeEl = document.getElementById("battery-time");
  const iconEl = document.getElementById("battery-icon");

  function renderIcon(charging, level){
    if(charging){
      iconEl.innerHTML = '<svg width="64" height="36" viewBox="0 0 48 28" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="40" height="20" rx="3" fill="#fff" opacity="0.08"/><rect x="42" y="10" width="4" height="8" rx="1" fill="#fff" opacity="0.08"/><polygon points="20,6 14,16 22,16 18,26 34,12 26,12" fill="#10b981"/></svg>';
    } else {
      const pct = Math.round(level*100);
      const fillW = Math.max(2, Math.round((pct/100)*36));
      const color = pct > 20 ? '#10b981' : '#f97316';
      iconEl.innerHTML = `<svg width="64" height="36" viewBox="0 0 48 28" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="40" height="20" rx="3" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/><rect x="42" y="10" width="4" height="8" rx="1" fill="rgba(255,255,255,0.12)"/><rect x="4" y="7" width="${fillW}" height="14" rx="2" fill="${color}"/></svg>`;
    }
  }

  function formatTime(seconds){
    if (!isFinite(seconds) || seconds <= 0) return "Unknown";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  async function updateBattery(bat){
    const chargingText = bat.charging ? "Charging" : "Not charging";
    const pct = Math.round(bat.level * 100) + "%";
    const timeText = bat.charging ? formatTime(bat.chargingTime) : formatTime(bat.dischargingTime);
    if (levelEl) levelEl.textContent = pct;
    if (timeEl) timeEl.textContent = timeText;
    if (statusEl) statusEl.textContent = chargingText;
    if (iconEl) renderIcon(bat.charging, bat.level);
  }

  async function initBattery(){
    if(!navigator.getBattery){
      if(statusEl) statusEl.textContent = "API not supported";
      if(levelEl) levelEl.textContent = "—";
      if(timeEl) timeEl.textContent = "—";
      return;
    }
    try{
      const bat = await navigator.getBattery();
      updateBattery(bat);
      bat.addEventListener('chargingchange', () => updateBattery(bat));
      bat.addEventListener('levelchange', () => updateBattery(bat));
      bat.addEventListener('chargingtimechange', () => updateBattery(bat));
      bat.addEventListener('dischargingtimechange', () => updateBattery(bat));
    } catch(e){
      console.error("Battery API error:", e);
      if(statusEl) statusEl.textContent = "Error";
    }
  }

  window.initBattery = initBattery;
  initBattery();
});
