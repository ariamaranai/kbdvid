{
  let d = document;
  let video = d.querySelector("video");
  if (video.autoplay) {
    chrome.runtime.sendMessage(video.autoplay = 0),
    onmouseup = e => e.button == 3 && d.fullscreenElement &&
      d.exitFullscreen(e.stopImmediatePropagation(e.preventDefault()));

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
          ? (video.pause(), video.currentTime += t)
          : video.requestFullscreen()
      );
    }
  }
}