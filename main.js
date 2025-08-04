chrome.runtime.sendMessage(0);
{
  let d = document;
  let videos = d.getElementsByTagName("video");
  let videoLen = videos.length;
  let video;
  if (videoLen == 1 && d.head.childElementCount == 1) {
    video = videos[0];
    onkeydown = e => {
      let k = e.keyCode;
      return k == 122 && !d.fullscreenElement
        ? video.requestFullscreen(e.preventDefault())
        : (
          k = 
              k == 39 ? 5
            : k == 37 ? -5
            : k == 190 ? .03333333333333333
            : k == 188 && -.03333333333333333
        ) == !1 || (
          e.preventDefault(),
          k > 39 && video.pause(),
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
  } else {
    let { scrollingElement } = d; 
    let cx = (innerWidth + scrollingElement.scrollLeft) / 2;
    let cy = (innerHeight + scrollingElement.scrollTop) / 2; 
    let minds = 2e9;
    let i = 0;
    while (i < videos.length) {
      let _video = videos[i];
      if (_video.readyState) {
        let rect = _video.getBoundingClientRect();
        let ds = Math.abs(cx - (rect.width / 2 + rect.x)) + Math.abs(cy - (rect.height / 2 + rect.y));
        ds < minds && (
          minds = ds,
          video = _video
        );
      }
      ++i;
    }

    addEventListener("mouseup", e =>
      e.button == 3 &&
      d.fullscreenElement &&
      d.exitFullscreen(e.stopImmediatePropagation(e.preventDefault())),
      1
    );
    addEventListener("keydown", e => {
      let k = e.keyCode;
      let t =
          k == 39 ? 5
        : k == 37 ? -5
        : k == 190 ? .03333333333333333
        : k == 188 && -.03333333333333333;
      return t == !1 || (
        e.stopImmediatePropagation(e.preventDefault()),
        k > 39 && video.pause(),
        video.currentTime += t
      );
    }, 1);
  }
}