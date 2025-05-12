{
  let d = document;
  let video = d.querySelector("video");
  if (video.childElementCount) {
    chrome.runtime.sendMessage(video.lastChild.remove());
    onkeydown = e => {
      let k = e.keyCode;
      return k == 8 || k == 17 || k == 46
        ? (
          e.preventDefault(),
          video.onclick = (video.controls = !video.controls)
            ? null
            : e => (e.preventDefault(), video[video.paused ? "play" : "pause"]())
        )
        : k == 122 && !d.fullscreenElement
          ? video.requestFullscreen(e.preventDefault())
          : (k = 
                k == 39 ? 5
              : k == 37 ? -5
              : k == 190 ? .03333333333333333
              : k == 188 && -.03333333333333333
            ) && (
              e.preventDefault(),
              Number.isInteger(k) || video.pause(),
              video.currentTime += k
            );
    }
    onmousedown = e => {
      let { button } = e;
      button > 2 && (
        e.preventDefault(),
        video.currentTime += button == 4 ? 5 : -5
      );
    }
    onwheel = e =>
      video.playbackRate = e.deltaY < 0
        ? Math.min(video.playbackRate + .25, 5)
        : Math.max(video.playbackRate - .25, 0.25);

    history.length > 1 &&
    (onpopstate = () => history.pushState("", "", ""))();
  }
}