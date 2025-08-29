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
    onwheel = e => {
      let { playbackRate } = video;
      video.playbackRate = e.deltaY < 0
        ? Math.min(playbackRate + .25, 5)
        : Math.max(playbackRate - .25, .25);
    }

    history.length > 1 &&
    (onpopstate = () => history.pushState("", "", ""))();
  } else {
    let { Math, innerWidth, innerHeight } = self;
    let { max, min } = Math;
    let maxVisibleSize = 0;
    let i = 0;
    while (i < videoLen) {
      let _video = videos[i];
      if (_video.readyState) {
        let { x, right, y, bottom } = _video.getBoundingClientRect();
        let visibleSize = max(min(right, innerWidth) - max(x, 0), 0) * max(min(bottom, innerHeight) - max(y, 0), 0);
        maxVisibleSize < visibleSize && (
          maxVisibleSize = visibleSize,
          video = _video
        );
      }
      ++i;
    }
    video && (
      addEventListener("mouseup", e =>
        e.button == 3 &&
        d.fullscreenElement &&
        location.host != "www.youtube.com" &&
        d.exitFullscreen(e.stopImmediatePropagation(e.preventDefault())),
        1
      ),
      addEventListener("keydown", e => {
        let k = e.keyCode;
        let t = k == 39 ? 5
              : k == 37 ? -5
              : k == 190 ? .03333333333333333
              : k == 188 && -.03333333333333333;
        return t == 0 || (
          e.stopImmediatePropagation(e.preventDefault()),
          k > 39 && video.pause(),
          video.currentTime += t
        )
      }, 1),
      addEventListener("wheel", e => {
        let p = e.x;
        let rect = video.getBoundingClientRect();
        p <= rect.right && p >= rect.x && (p = e.y) <= rect.bottom && p >= rect.y && (
          e.preventDefault(),
          p = video.playbackRate,
          video.playbackRate = e.deltaY < 0
            ? Math.min(p + .25, 5)
            : Math.max(p - .25, .25)
        );
      }, { capture: !0, passive: !1 })
    );
  }
}