document.addEventListener("DOMContentLoaded", () => {
  console.log("keyboard.js loaded");
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }

  // Layout inspirado en Chromebook (filas)
  const layout = [
    // Row 1: Esc, Search (magnifier), F keys omitted for compactness
    ["Esc","Search","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    // Row 2: Tab row (Q-P)
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    // Row 3: Caps row (A-L)
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    // Row 4: Shift row (Z-M)
    ["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],
    // Row 5: Bottom row with Ctrl, Alt, Search/Launcher, Space, AltRight, Arrow keys
    ["Ctrl","AltLeft","Search","Space","AltRight","←","↑","↓","→"]
  ];

  // crear DOM
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      // normalizar etiquetas para dataset
      k.dataset.keyLabel = key;
      k.textContent = key;
      // clases especiales para anchos
      if (key === "Space") k.classList.add("Space");
      if (key === "Backspace") k.classList.add("Backspace");
      if (key === "Enter") k.classList.add("Enter");
      if (key === "Caps") k.classList.add("Caps");
      if (key === "Search") k.classList.add("Search");
      r.appendChild(k);
    });
    kb.appendChild(r);
  });

  // Mapa de normalización de event.key a etiquetas del teclado
  const normalizeMap = {
    "Escape":"Esc","Backspace":"Backspace","Enter":"Enter","Tab":"Tab",
    " ":"Space","Spacebar":"Space","Control":"Ctrl","Alt":"AltLeft",
    "Meta":"Search","OS":"Search","ContextMenu":"Menu","CapsLock":"Caps",
    "ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓",
    "Shift":"Shift"
  };

  function findKeyElementByEventKey(eKey, code) {
    // Priorizar mapeo por key, luego por code para AltRight/AltLeft
    const label = normalizeMap[eKey] || (eKey.length === 1 ? eKey.toUpperCase() : eKey);
    // handle AltRight explicitly using code
    if (code === "AltRight") return [...document.querySelectorAll(".key")].find(k => k.dataset.keyLabel === "AltRight");
    // find by label
    return [...document.querySelectorAll(".key")].find(k => k.dataset.keyLabel === label);
  }

  // mantener un set de teclas presionadas para evitar duplicados
  const pressed = new Set();

  window.addEventListener("keydown", (e) => {
    // evitar repetir si ya está presionada
    const el = findKeyElementByEventKey(e.key, e.code);
    if (!el) return;
    if (pressed.has(e.code)) return;
    pressed.add(e.code);
    el.classList.add("active");
  });

  window.addEventListener("keyup", (e) => {
    const el = findKeyElementByEventKey(e.key, e.code);
    if (!el) return;
    pressed.delete(e.code);
    el.classList.remove("active");
  });

  // si la ventana pierde foco, limpiar estados
  window.addEventListener("blur", () => {
    pressed.clear();
    document.querySelectorAll(".key.active").forEach(k => k.classList.remove("active"));
  });

  // permitir click en tecla para simular pulsación (útil en pantallas táctiles)
  kb.addEventListener("pointerdown", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.add("active");
  });
  kb.addEventListener("pointerup", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
  });
});
