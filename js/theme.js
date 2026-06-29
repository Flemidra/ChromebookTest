// js/theme.js
(function(){
  function applyTheme(t){
    if(t === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
  }
  // default: dark
  let saved = localStorage.getItem('theme');
  if(!saved) saved = 'dark';
  applyTheme(saved);

  window.toggleTheme = function(){
    const isLight = document.documentElement.classList.contains('light');
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  };
})();
