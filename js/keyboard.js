// js/keyboard.js - Finalized: persistent pressed state, Chromebook layout, robust mapping
document.addEventListener("DOMContentLoaded", () => {
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }

  // Layout using dataset keys (codes or logical names)
  const layout = [
    ["Esc","Search","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    ["ShiftLeft","Z","X","C","V","B","N","M",",",".","/","ShiftRight"],
    ["CtrlLeft","AltLeft","Search","Space","AltRight","ArrowLeft","ArrowUp","ArrowDown","ArrowRight"]
  ];

  // Create DOM
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;
      // human readable label
      const labelMap = {
        "Space":"Space","ShiftLeft":"Shift","ShiftRight":"Shift","CtrlLeft":"Ctrl","CtrlRight":"Ctrl",
        "AltLeft":"Alt","AltRight":"Alt","Search":"Search","ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓",
        "Backspace":"Backspace","Enter":"Enter","Caps":"Caps","Tab":"Tab","Esc":"Esc"
      };
      k.textContent = labelMap[key] || (key.length === 1 ? key : key);
      // add classes for width styling (CSS handles exact widths)
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

  // Helper: find key element by event (prefer event.code for modifiers/arrows)
  function findKeyElementByEvent(e) {
    const code = e.code || "";
    const key = e.key || "";

    // direct code mapping for common special keys
    const codeMap = {
      "Space":"Space","ShiftLeft":"ShiftLeft","ShiftRight":"ShiftRight",
      "AltLeft":"AltLeft","AltRight":"AltRight","ControlLeft":"CtrlLeft","ControlRight":"CtrlRight",
      "ArrowLeft":"ArrowLeft","ArrowRight":"ArrowRight","ArrowUp":"ArrowUp","ArrowDown":"ArrowDown",
      "Backspace":"Backspace","Enter":"Enter","Tab":"Tab","Escape":"Esc"
    };
    if (codeMap[code]) {
      const el = document.querySelector(`.key[data-key-label="${codeMap[code]}"]`);
      if (el) return el;
    }

    // fallback: map key to visible label
    const keyMap = {"ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓"};
    const label = (key === " " ? "Space" : (keyMap[key] || (key.length === 1 ? key.toUpperCase() : key)));
    // try dataset match first (some keys use dataset labels like "AltRight")
    let el = document.querySelector(`.key[data-key-label="${label}"]`);
    if (el) return el;
    // then try by visible text content
    el = [...document.querySelectorAll(".key")].find(k => k.textContent === label);
    return el || null;
  }

  // Track physically pressed codes to avoid repeats
  const pressedPhysical = new Set();

  // keydown: add temporary active state (while held)
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

  // pointer interactions: pointerdown shows active, pointerup toggles persistent pressed
  kb.addEventListener("pointerdown", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.setPointerCapture(ev.pointerId);
    keyEl.classList.add("active");
  });

  kb.addEventListener("pointerup", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    try { keyEl.releasePointerCapture(ev.pointerId); } catch(e){}
    keyEl.classList.remove("active");
    if (!keyEl.classList.contains("pressed")) keyEl.classList.add("pressed");
  });

  // contextmenu / cancel: ensure active cleared
  kb.addEventListener("pointercancel", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
  });

  // Expose utilities for testing and control
  window.keyboardUtils = {
    resetPressed: () => {
      document.querySelectorAll(".key.pressed").forEach(k => k.classList.remove("pressed"));
    },
    getPressedKeys: () => {
      return [...document.querySelectorAll(".key.pressed")].map(k => {
        // return readable label if dataset is a code name
        const ds = k.dataset.keyLabel;
        const labelMap = {"ShiftLeft":"Shift","ShiftRight":"Shift","CtrlLeft":"Ctrl","CtrlRight":"Ctrl","AltLeft":"Alt","AltRight":"Alt","Space":"Space"};
        return labelMap[ds] || k.textContent;
      });
    },
    markKeyPressed: (labelOrDataset) => {
      // allow marking by dataset keyLabel or visible label
      let el = document.querySelector(`.key[data-key-label="${labelOrDataset}"]`);
      if (!el) el = [...document.querySelectorAll(".key")].find(k => k.textContent === labelOrDataset);
      if (el) el.classList.add("pressed");
    }
  };

  console.log("Keyboard initialized. Use keyboardUtils.getPressedKeys() and keyboardUtils.resetPressed().");
});
