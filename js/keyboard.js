// js/keyboard.js - Versión estable sin CtrlRight
// - Single Search key in letter row
// - No CtrlRight to avoid layout regressions
// - Cada key contiene span.key-label para control visual
// - Robust mapping para keydown/keyup y soporte pointer
// - Evita duplicados y mantiene comportamiento consistente

document.addEventListener("DOMContentLoaded", function () {
  const kb = document.getElementById("keyboard");
  if (!kb) {
    console.error("Keyboard container not found (#keyboard)");
    return;
  }

  // Layout conservador: NO CtrlRight, Search solo en fila de letras
  const layout = [
    // Row 1
    ["Esc", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    // Row 2
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    // Row 3 (Search en lugar de Caps)
    ["Search", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    // Row 4
    ["ShiftLeft", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "ShiftRight"],
    // Row 5 (bottom row) - sin CtrlRight
    ["CtrlLeft", "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]
  ];

  // Visible label map
  const labelMap = {
    "Space": "Space",
    "ShiftLeft": "Shift", "ShiftRight": "Shift",
    "CtrlLeft": "Ctrl",
    "AltLeft": "Alt", "AltRight": "Alt",
    "Search": "Search",
    "ArrowLeft": "←", "ArrowRight": "→", "ArrowUp": "↑", "ArrowDown": "↓",
    "Backspace": "Backspace", "Enter": "Enter", "Tab": "Tab", "Esc": "Esc"
  };

  // Build DOM: each key gets a span.key-label
  layout.forEach(function (row) {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(function (key) {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;

      const span = document.createElement("span");
      span.className = "key-label";
      span.textContent = labelMap[key] || (key.length === 1 ? key : key);
      k.appendChild(span);

      if (key === "Space") k.classList.add("Space");
      if (key === "Backspace") k.classList.add("Backspace");
      if (key === "Enter") k.classList.add("Enter");
      if (key === "ShiftLeft" || key === "ShiftRight") k.classList.add("Shift");
      if (key === "Search") k.classList.add("Search");

      r.appendChild(k);
    });
    kb.appendChild(r);
  });

  // Normalize event to dataset label (robust mapping)
  function normalizeEventToLabel(e) {
    const code = e.code || "";
    const key = e.key || "";

    const codeMap = {
      "Space": "Space",
      "ShiftLeft": "ShiftLeft", "ShiftRight": "ShiftRight",
      "AltLeft": "AltLeft", "AltRight": "AltRight",
      "ControlLeft": "CtrlLeft", "ControlRight": "CtrlRight",
      "ArrowLeft": "ArrowLeft", "ArrowRight": "ArrowRight", "ArrowUp": "ArrowUp", "ArrowDown": "ArrowDown",
      "Backspace": "Backspace", "Enter": "Enter", "Tab": "Tab", "Escape": "Esc"
    };
    if (codeMap[code]) return codeMap[code];

    // Common Search/Launcher variants on Chromebooks and other devices
    const searchCodes = ["Search", "MetaLeft", "OSLeft", "LaunchApp", "BrowserSearch", "Launcher", "Meta", "OS"];
    if (searchCodes.includes(code) || searchCodes.includes(key)) return "Search";

    // Some platforms report key names instead of codes
    const keyMap = {
      "ArrowLeft": "ArrowLeft", "ArrowRight": "ArrowRight", "ArrowUp": "ArrowUp", "ArrowDown": "ArrowDown",
      " ": "Space",
      "Search": "Search",
      "Launcher": "Search",
      "Meta": "Search",
      "OS": "Search"
    };
    if (keyMap[key]) return keyMap[key];

    // Fallback: single-character keys -> uppercase label
    if (key && key.length === 1) return key.toUpperCase();

    return null;
  }

  function findKeyElementByEvent(e) {
    const label = normalizeEventToLabel(e);
    if (!label) return null;

    // dataset match
    let el = document.querySelector('.key[data-key-label="' + label + '"]');
    if (el) return el;

    // match by visible label text
    el = Array.prototype.slice.call(document.querySelectorAll(".key")).find(function (k) {
      const span = k.querySelector(".key-label");
      return span && span.textContent === label;
    });
    return el || null;
  }

  // Avoid auto-repeat duplicates
  const pressedPhysical = new Set();

  window.addEventListener("keydown", function (e) {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    if (pressedPhysical.has(e.code)) return;
    pressedPhysical.add(e.code);
    el.classList.add("active");
  }, { passive: true });

  window.addEventListener("keyup", function (e) {
    const el = findKeyElementByEvent(e);
    if (!el) return;
    pressedPhysical.delete(e.code);
    el.classList.remove("active");
    if (!el.classList.contains("pressed")) el.classList.add("pressed");
  }, { passive: true });

  window.addEventListener("blur", function () {
    pressedPhysical.clear();
    Array.prototype.slice.call(document.querySelectorAll(".key.active")).forEach(function (k) {
      k.classList.remove("active");
    });
  });

  // Pointer interactions for touch/mouse
  kb.addEventListener("pointerdown", function (ev) {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    try { keyEl.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    keyEl.classList.add("active");
  });

  kb.addEventListener("pointerup", function (ev) {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    try { keyEl.releasePointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    keyEl.classList.remove("active");
    if (!keyEl.classList.contains("pressed")) keyEl.classList.add("pressed");
  });

  kb.addEventListener("pointercancel", function (ev) {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
  });

  // Utilities
  window.keyboardUtils = {
    resetPressed: function () {
      Array.prototype.slice.call(document.querySelectorAll(".key.pressed")).forEach(function (k) {
        k.classList.remove("pressed");
      });
    },
    getPressedKeys: function () {
      return Array.prototype.slice.call(document.querySelectorAll(".key.pressed")).map(function (k) {
        const ds = k.dataset.keyLabel;
        const map = { "ShiftLeft": "Shift", "ShiftRight": "Shift", "CtrlLeft": "Ctrl", "AltLeft": "Alt", "AltRight": "Alt", "Space": "Space", "Search": "Search" };
        return map[ds] || (k.querySelector(".key-label") ? k.querySelector(".key-label").textContent : ds);
      });
    },
    markKeyPressed: function (labelOrDataset) {
      let el = document.querySelector('.key[data-key-label="' + labelOrDataset + '"]');
      if (!el) {
        el = Array.prototype.slice.call(document.querySelectorAll(".key")).find(function (k) {
          const span = k.querySelector(".key-label");
          return span && span.textContent === labelOrDataset;
        });
      }
      if (el) el.classList.add("pressed");
    }
  };

  console.log("Keyboard initialized (stable version without CtrlRight).");
});
