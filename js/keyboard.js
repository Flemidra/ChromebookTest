document.addEventListener("DOMContentLoaded", () => {
  console.log("keyboard.js loaded");
  const kb = document.getElementById("keyboard");
  if (!kb) { console.error("Keyboard container not found (#keyboard)"); return; }
  const layout = [
    ["Esc","`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Search","Q","W","E","R","T","Y","U","I","O","P","[","]"],
    ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"],
    ["Ctrl","Alt","Space","Alt","Ctrl","←","↓","→"]
  ];
  layout.forEach(row => {
    const r = document.createElement("div");
    r.className = "k-row";
    row.forEach(key => {
      const k = document.createElement("div");
      k.className = "key";
      k.dataset.keyLabel = key;
      k.textContent = key;
      r.appendChild(k);
    });
    kb.appendChild(r);
  });
  const normalizeMap = {"Escape":"Esc","Backspace":"Backspace","Enter":"Enter"," ":"Space","Spacebar":"Space","Control":"Ctrl","Ctrl":"Ctrl","Alt":"Alt","Meta":"Search","OS":"Search","Search":"Search","CapsLock":"Caps","ArrowLeft":"←","ArrowRight":"→","ArrowUp":"↑","ArrowDown":"↓"};
  function findKeyElementByEventKey(eKey) {
    const label = normalizeMap[eKey] || (eKey.length === 1 ? eKey.toUpperCase() : eKey);
    return [...document.querySelectorAll(".key")].find(k => k.dataset.keyLabel === label);
  }
  window.addEventListener("keydown", (e) => {
    const el = findKeyElementByEventKey(e.key);
    if (el) el.classList.add("active");
  });
  window.addEventListener("keyup", (e) => {
    const el = findKeyElementByEventKey(e.key);
    if (el) el.classList.remove("active");
  });
  window.addEventListener("blur", () => {
    document.querySelectorAll(".key.active").forEach(k => k.classList.remove("active"));
  });
});
