/* WEAVER chapter navigation (v60).
   Standard Vimeo timestamp links remain usable if the Vimeo SDK does not load.
   When it loads, selection seeks the existing embedded video on the same page. */
(function () {
  var index = document.querySelector('.p-weaver .weaver-chapters');
  var frame = document.querySelector('#weaver-performance-player iframe');
  if (!index || !frame) return;

  var player = null;
  function getPlayer() {
    if (!window.Vimeo || typeof window.Vimeo.Player !== 'function') return null;
    if (!player) player = new window.Vimeo.Player(frame);
    return player;
  }

  index.querySelectorAll('a[data-weaver-seconds]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var video = getPlayer();
      if (!video) return; // The native href opens Vimeo at this timecode.
      event.preventDefault();
      var second = Number(link.getAttribute('data-weaver-seconds'));
      video.setCurrentTime(second).then(function () {
        frame.scrollIntoView({behavior: 'smooth', block: 'center'});
        // A browser may restrict playback before a manual click on the player.
        // If so, keep the player at the requested position without opening a new tab.
        return video.play().catch(function () {});
      }).catch(function () {
        window.open(link.href, '_blank', 'noopener,noreferrer');
      });
    });
  });
})();
