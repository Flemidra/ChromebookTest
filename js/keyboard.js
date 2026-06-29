// js/keyboard.js
document.addEventListener("DOMContentLoaded", () => {
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }

  // Layout inspirado en Chromebook (filas). Etiquetas visibles.
  const layout = [
    ["Esc","Search","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"],
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    ["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"],
    ["Ctrl","AltLeft","Search","Space","AltRight","←","↑","↓","→"]
  ];

  // Crear DOM del teclado
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;
      k.textContent = key;
      // clases para anchos
      if (key === "Space") k.classList.add("Space");
      if (key === "Backspace") k.classList.add("Backspace");
      if (key === "Enter") k.classList.add("Enter");
      if (key === "Caps") k.classList.add("Caps");
      if (key === "Shift") k.classList.add("Shift");
      if (key === "Search") k.classList.add("Search");
      r.appendChild(k);
    });
    kb.appendChild(r);
  });

  // Mapa para normalizar event.key / event.code a etiquetas del layout
  const normalizeMap = {
    "Escape":"Esc","Backspace":"Backspace","Enter":"Enter","Tab":"Tab",
    " ":"Space","Spacebar":"Space","Control":"Ctrl","Alt":"AltLeft",
    "Meta":"Search","OS":"Search","ContextMenu":"Menu","CapsLock":"Caps",
    "ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓",
    "Shift":"Shift"
  };

  // Buscar elemento de tecla por event.key o event.code (soporta AltRight)
  function findKeyElement(e) {
    const byCode = (code) => {
      if (code === "AltRight") return document.querySelector('.key[data-key-label="AltRight"]');
      if (code === "ArrowUp") return document.querySelector('.key[data-key-label="↑"]');
      if (code === "ArrowDown") return document.querySelector('.key[data-key-label="↓"]');
      if (code === "ArrowLeft") return document.querySelector('.key[data-key-label="←"]');
      if (code === "ArrowRight") return document.querySelector('.key[data-key-label="→"]');
      return null;
    };
    const codeMatch = byCode(e.code);
    if (codeMatch) return codeMatch;

    const label = normalizeMap[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : e.key);
    return document.querySelector(`.key[data-key-label="${label}"]`);
  }

  // Set para teclas físicamente presionadas (evitar repetidos)
  const pressedPhysical = new Set();

  // Cuando se presiona físicamente: añadir clase active (temporal)
  window.addEventListener("keydown", (e) => {
    const el = findKeyElement(e);
    if (!el) return;
    if (pressedPhysical.has(e.code)) return; // evitar repeats
    pressedPhysical.add(e.code);
    el.classList.add("active");
  });

  // Al soltar: quitar active y añadir pressed (persistente)
  window.addEventListener("keyup", (e) => {
    const el = findKeyElement(e);
    if (!el) return;
    pressedPhysical.delete(e.code);
    el.classList.remove("active");
    // si ya estaba pressed, no cambiar; si no, marcar como pressed
    if (!el.classList.contains("pressed")) el.classList.add("pressed");
  });

  // Si la ventana pierde foco, limpiar active (pero no pressed)
  window.addEventListener("blur", () => {
    pressedPhysical.clear();
    document.querySelectorAll(".key.active").forEach(k => k.classList.remove("active"));
  });

  // Interacción táctil: pointerdown activa, pointerup marca como pressed (toggle)
  kb.addEventListener("pointerdown", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.add("active");
  });
  kb.addEventListener("pointerup", (ev) => {
    const keyEl = ev.target.closest(".key");
    if (!keyEl) return;
    keyEl.classList.remove("active");
    // alternar pressed: si ya estaba pressed, dejarlo (o permitir desmarcar si quieres)
    if (!keyEl.classList.contains("pressed")) keyEl.classList.add("pressed");
  });

  // Funciones utilitarias expuestas en window para pruebas y control
  window.keyboardUtils = {
    resetPressed: () => {
      document.querySelectorAll(".key.pressed").forEach(k => k.classList.remove("pressed"));
    },
    getPressedKeys: () => {
      return [...document.querySelectorAll(".key.pressed")].map(k => k.dataset.keyLabel);
    },
    markKeyPressed: (label) => {
      const el = document.querySelector(`.key[data-key-label="${label}"]`);
      if (el) el.classList.add("pressed");
    }
  };

  console.log("Keyboard initialized. Use keyboardUtils.getPressedKeys() or resetPressed().");
});
