// js/keyboard.js - persistent pressed state, Chromebook layout, robust mapping
document.addEventListener("DOMContentLoaded", () => {
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }

  // Layout con anchos relativos por tecla (ver CSS para grid sizing)
  const layout = [
    ["Esc","Search","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    ["ShiftLeft","Z","X","C","V","B","N","M",",",".","/","ShiftRight"],
    ["CtrlLeft","AltLeft","Search","Space","AltRight","ArrowLeft","ArrowUp","ArrowDown","ArrowRight"]
  ];

  // Crear DOM
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;
      // Mostrar etiqueta legible (mapa simple)
      const labelMap = {
        "Space":"Space","ShiftLeft":"Shift","ShiftRight":"Shift","CtrlLeft":"Ctrl","AltLeft":"Alt",
        "AltRight":"Alt","Search":"Search","ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓",
        "Backspace":"Backspace","Enter":"Enter","Caps":"Caps","Tab":"Tab","Esc":"Esc"
      };
      k.textContent = labelMap[key] || (key.length === 1 ? key : key);
      // clases para anchos
      if (key === "Space") k.classList.add("Space");
      if (key === "Backspace") k.classList.add("Backspace");
      if (key === "Enter") k.classList.add("Enter");
      if (key === "Caps") k.classList.add("Caps");
      if (key === "ShiftLeft" || key === "ShiftRight") k.classList.add("Shift");
      if (key === "Search") k.classList.add("Search");
      r.appendChild(k);
    });
    kb.appendChild(r);
  });

  // Normalización: event.code preferido para teclas modificadoras y flechas
  function findKeyElementByEvent(e) {
    // Priorizar code para AltRight, ShiftRight, CtrlLeft, etc.
    const code = e.code || "";
    const key = e.key || "";
    // map code -> dataset keyLabel
    const codeMap = {
      "Space":"Space","ShiftLeft":"ShiftLeft","ShiftRight":"ShiftRight",
      "AltLeft":"AltLeft","AltRight":"AltRight","ControlLeft":"CtrlLeft","ControlRight":"CtrlRight",
      "ArrowLeft":"ArrowLeft","ArrowRight":"ArrowRight","ArrowUp":"ArrowUp","ArrowDown":"ArrowDown",
      "Backspace":"Backspace","Enter":"Enter","Tab":"Tab","Escape":"Esc"
    };
    if (codeMap[code]) {
      // buscar por dataset exacto (ej: AltRight)
      const el = document.querySelector(`.key[data-key-label="${codeMap[code]}"]`);
      if (el) return el;
    }
    // fallback por key (caracteres y etiquetas)
    const label = (key.length === 1) ? key.toUpperCase() : (key === " " ? "Space" : key);
    // map arrow symbols
    const keyMap = {"ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓"};
    const mapped = keyMap[key] || label;
    // buscar por texto o dataset
    return [...document.querySelectorAll(".key")].find(k => k.dataset.keyLabel === mapped || k.textContent === mapped);
  }

  const pressedPhysical = new Set();

  window.addEventListener("keydown", (e) => {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    if (pressedPhysical.has(e.code)) return; // evitar repeats
    pressedPhysical.add(e.code);
    el.classList.add("active"); // visual temporal mientras se mantiene
  });

  window.addEventListener("keyup", (e) => {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    pressedPhysical.delete(e.code);
    el.classList.remove("active");
    // persistir: marcar como pressed permanentemente
    if (!el.classList.contains("pressed")) el.classList.add("pressed");
  });

  window.addEventListener("blur", () => {
    pressedPhysical.clear();
    document.querySelectorAll(".key.active").forEach(k => k.classList.remove("active"));
  });

  // pointer interactions: marcar permanentemente al soltar
  kb.addEventListener("pointerdown", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.add("active");
  });
  kb.addEventListener("pointerup", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
    if (!keyEl.classList.contains("pressed")) keyEl.classList.add("pressed");
  });

  // utilidades
  window.keyboardUtils = {
    resetPressed: () => document.querySelectorAll(".key.pressed").forEach(k => k.classList.remove("pressed")),
    getPressedKeys: () => [...document.querySelectorAll(".key.pressed")].map(k => k.dataset.keyLabel)
  };

  console.log("Keyboard ready. Use keyboardUtils.getPressedKeys() / resetPressed().");
});
