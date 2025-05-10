{
  let d = document;
  let video = d.querySelector("video");
  if (video.childElementCount) {
    chrome.runtime.sendMessage(video.lastChild.remove());
    onkeydown = e => {
      let k = e.keyCode;
      let t =
          k == 39 ? 5
        : k == 37 ? -5
        : k == 190 ? .03333333333333333
        : k == 188 ? -.03333333333333333
        : k == 122 && !d.fullscreenElement;
      t && (
        e.preventDefault(),
        t != !0
          ? (k > 39 && video.pause(), video.currentTime += t)
          : video.requestFullscreen()
      );
    }
    onmouseup = e => e.button == 3 && d.fullscreenElement && d.exitFullscreen(e.preventDefault());
    onwheel = e =>
      video.playbackRate = e.deltaY < 0
        ? Math.min(video.playbackRate + .25, 5)
        : Math.max(video.playbackRate - .25, 0.25);
  }
}