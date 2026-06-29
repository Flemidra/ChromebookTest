// js/keyboard.js - Finalized: persistent pressed state, Chromebook layout, robust mapping
document.addEventListener("DOMContentLoaded", () => {
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }

  // Layout matching Chromebook physical order (retest.us style)
  const layout = [
    // Row 1
    ["Esc","Search","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    // Row 2
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    // Row 3
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    // Row 4
    ["ShiftLeft","Z","X","C","V","B","N","M",",",".","/","ShiftRight"],
    // Row 5 (bottom)
    ["CtrlLeft","AltLeft","Search","Space","AltRight","ArrowLeft","ArrowUp","ArrowDown","ArrowRight"]
  ];

  // Build DOM
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;
      const labelMap = {
        "Space":"Space","ShiftLeft":"Shift","ShiftRight":"Shift","CtrlLeft":"Ctrl","CtrlRight":"Ctrl",
        "AltLeft":"Alt","AltRight":"Alt","Search":"Search","ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓",
        "Backspace":"Backspace","Enter":"Enter","Caps":"Caps","Tab":"Tab","Esc":"Esc"
      };
      k.textContent = labelMap[key] || (key.length === 1 ? key : key);
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

  // Find key element by event (prefer event.code for modifiers/arrows)
  function findKeyElementByEvent(e) {
    const code = e.code || "";
    const key = e.key || "";

    const codeMap = {
      "Space":"Space","ShiftLeft":"ShiftLeft","ShiftRight":"ShiftRight",
      "AltLeft":"AltLeft","AltRight":"AltRight","ControlLeft":"CtrlLeft","ControlRight":"CtrlRight",
      "ArrowLeft":"ArrowLeft","ArrowRight":"ArrowRight","ArrowUp":"ArrowUp","ArrowDown":"ArrowDown",
      "Backspace":"Backspace","Enter":"Enter","Tab":"Tab","Escape":"Esc","Escape":"Esc"
    };
    if (codeMap[code]) {
      const el = document.querySelector(`.key[data-key-label="${codeMap[code]}"]`);
      if (el) return el;
    }

    const keyMap = {"ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓"};
    const label = (key === " " ? "Space" : (keyMap[key] || (key.length === 1 ? key.toUpperCase() : key)));
    let el = document.querySelector(`.key[data-key-label="${label}"]`);
    if (el) return el;
    el = [...document.querySelectorAll(".key")].find(k => k.textContent === label);
    return el || null;
  }

  // Track physically pressed codes to avoid repeats
  const pressedPhysical = new Set();

  // keydown: add temporary active state while held
  window.addEventListener("keydown", (e) => {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    if (pressedPhysical.has(e.code)) return; // ignore auto-repeat
    pressedPhysical.add(e.code);
    el.classList.add("active");
  }, {passive:true});

  // keyup: remove active and add persistent pressed
  window.addEventListener("keyup", (e) => {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    pressedPhysical.delete(e.code);
    el.classList.remove("active");
    if (!el.classList.contains("pressed")) el.classList.add("pressed");
  }, {passive:true});

  // blur: clear active states but keep pressed
  window.addEventListener("blur", () => {
    pressedPhysical.clear();
    document.querySelectorAll(".key.active").forEach(k => k.classList.remove("active"));
  });

  // pointer interactions: pointerdown shows active, pointerup marks persistent pressed
  kb.addEventListener("pointerdown", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    try { keyEl.setPointerCapture(ev.pointerId); } catch(e){}
    keyEl.classList.add("active");
  });

  kb.addEventListener("pointerup", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    try { keyEl.releasePointerCapture(ev.pointerId); } catch(e){}
    keyEl.classList.remove("active");
    if (!keyEl.classList.contains("pressed")) keyEl.classList.add("pressed");
  });

  kb.addEventListener("pointercancel", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
  });

  // Utilities exposed for debugging/control
  window.keyboardUtils = {
    resetPressed: () => {
      document.querySelectorAll(".key.pressed").forEach(k => k.classList.remove("pressed"));
    },
    getPressedKeys: () => {
      return [...document.querySelectorAll(".key.pressed")].map(k => {
        const ds = k.dataset.keyLabel;
        const labelMap = {"ShiftLeft":"Shift","ShiftRight":"Shift","CtrlLeft":"Ctrl","CtrlRight":"Ctrl","AltLeft":"Alt","AltRight":"Alt","Space":"Space"};
        return labelMap[ds] || k.textContent;
      });
    },
    markKeyPressed: (labelOrDataset) => {
      let el = document.querySelector(`.key[data-key-label="${labelOrDataset}"]`);
      if (!el) el = [...document.querySelectorAll(".key")].find(k => k.textContent === labelOrDataset);
      if (el) el.classList.add("pressed");
    }
  };

  console.log("Keyboard initialized. Use keyboardUtils.getPressedKeys() and keyboardUtils.resetPressed().");
});
