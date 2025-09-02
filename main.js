chrome.runtime.sendMessage(0);
{
  let d = document;
  let videos = d.getElementsByTagName("video");
  let videoLen = videos.length;
  let video;
  let { max, min } = Math;
  let speeder = d.createElement("speeder");
  speeder.setAttribute("style", "position:fixed;z-index:2147483647;width:64px;height:24px;border-radius:4px;background:#0009;font:600 12px/2 arial;color:#eee;text-align:center");
  speeder.hidden = 1;
  let px = CSS.px(0);
  let ex;
  let ey;
  let timer = 0;

  if (videoLen == 1 && d.head.childElementCount == 1) {
    (video = videos[0]).after(speeder);
    onkeydown = e => {
      let k = e.keyCode;
      if (k == 122 && !d.fullscreenElement)
        video.requestFullscreen(e.preventDefault())
      else {
        let _k =
            k == 39 ? 5
          : k == 37 ? -5
          : k == 190 ? .03333333333333333
          : k == 188 && -.03333333333333333;
        _k
          ? (e.preventDefault(), _k > 39 && video.pause(), video.currentTime += _k)
          : (_k = k == 38 ? .1 : k == 40 && -.1) && (video.volume = min(max(video.volume + _k, 0), 1));
      }
      return !0;
    }
    onmousedown = e => {
      let { button } = e;
      button > 2 && (
        e.preventDefault(),
        video.currentTime += button < 4 ? -5 : 5
      );
    }
    onwheel = e => {
      let { playbackRate } = video;
      let { y } = video.getBoundingClientRect();
      let w = innerWidth;
      speeder.textContent = (
        video.playbackRate = e.deltaY < 0
            ? min(playbackRate + .25, 5)
            : max(playbackRate - .25, .25)
      ) + "x";
      ex != w && speeder.attributeStyleMap.set("left", (px.value = (ex = w) / 2 - 32, px));
      ey != y && speeder.attributeStyleMap.set("top", (px.value = (ey = y) + 8, px));
      speeder.hidden = clearTimeout(timer);
      timer = setTimeout(() => speeder.hidden = 1, 1500);
    }
    history.length > 1 &&
    (onpopstate = () => history.pushState("", "", ""))();
  } else {
    let { innerWidth, innerHeight } = self;
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
    if (video) {
      video.after(speeder);
      let isSkip;
      addEventListener("mousedown", e => {
        let { button } = e;
        if (button > 2) {
          let p = e.x;
          let rect = video.getBoundingClientRect();
          p <= rect.right && p >= rect.x && (p = e.y) <= rect.bottom && p >= rect.y && (
            e.stopImmediatePropagation(e.preventDefault()),
            video.currentTime += button < 4 ? -5 : 5,
            isSkip = 1
          )
        }
      }, 1),
      addEventListener("mouseup", e =>
        isSkip = (isSkip && e.stopImmediatePropagation(e.preventDefault()), 0),
      1);
      addEventListener("keydown", e => {
        let k = e.keyCode;
        let t = k == 39 ? 5
              : k == 37 ? -5
              : k == 190 ? .03333333333333333
              : k == 188 && -.03333333333333333;
        return t && (
          e.stopImmediatePropagation(e.preventDefault()),
          k > 39 && video.pause(),
          video.currentTime += t
        )
      }, 1);
      addEventListener("wheel", e => {
        let p = e.x;
        let rect = video.getBoundingClientRect();
        let { x, y } = rect;
        if (p >= x && p <= rect.right && (p = e.y) >= y && p <= rect.bottom) {
              e.preventDefault();
              p = video.playbackRate;
              let value = x + rect.width / 2;
              ex != value && speeder.attributeStyleMap.set("left", (px.value = (ex = value) - 32, px));
              ey != y && speeder.attributeStyleMap.set("top", (px.value = (ey = y) + 8, px));
              speeder.textContent = (
                video.playbackRate = e.deltaY < 0
                  ? min(p + .25, 5)
                  : max(p - .25, .25)
              ) + "x";
              clearTimeout(timer);
              timer = setTimeout(() => speeder.hidden = 1, 1500);
              speeder.hidden = 0;
        } else
          speeder.hidden = 1;
      }, { capture: !0, passive: !1 });
    }
  }
}