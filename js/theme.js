document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  function applyTheme(t) {
    if (t === "light") document.body.classList.add("light");
    else document.body.classList.remove("light");
  }
  let saved = localStorage.getItem("theme");
  if (!saved) saved = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(saved);
  if (toggle) toggle.onclick = () => {
    const newTheme = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };
});
