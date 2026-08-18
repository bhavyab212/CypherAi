(function () {
  function initLoader() {
    var loader = document.getElementById('phantom-boot-loader');
    var bar = document.getElementById('pbl-progress-bar');
    var text = document.getElementById('pbl-percentage');
    if (!loader || !bar || !text) return;

    var progress = 0;
    var startTime = performance.now();
    var duration = 1600;

    function frame(now) {
      var elapsed = now - startTime;
      var t = Math.min(1, elapsed / duration);
      // easeOutCubic: 1 - Math.pow(1 - t, 3)
      var eased = 1 - Math.pow(1 - t, 3);
      progress = Math.round(eased * 100);

      bar.style.width = progress + '%';
      text.textContent = progress + '%';

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(function () {
          loader.classList.add('pbl-fade-out');
          setTimeout(function () {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }, 650);
        }, 250);
      }
    }

    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
