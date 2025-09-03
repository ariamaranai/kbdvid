chrome.runtime.sendMessage(0);
{
  let d = document;
  let videos = d.getElementsByTagName("video");
  let videoLen = videos.length;
  let video;
  let { max, min } = Math;
  let modal = d.createElement("modal");
  let brightness = 100;
  let px = CSS.px(0);
  let ex;
  let ey;
  let timer = 0;
  let rightClick = 0;

  modal.setAttribute("style", "all:unset;position:fixed;z-index:2147483647;width:64px;height:24px;border-radius:4px;background:#0009;font:600 12px/2 arial;color:#eee;text-align:center;user-select:none");
  modal.hidden = "until-found";

  if (videoLen == 1 && d.head.childElementCount == 1) {
    let root = d.documentElement;
    (video = videos[0]).after(modal);
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
      button > 1 && (
        e.preventDefault(),
        (rightClick = button == 2) || (video.currentTime += button < 4 ? -5 : 5)
      );
    }
    onmouseup = () => rightClick = 0;
    onwheel = e => {
      let delta = e.deltaY < 0;
      if (rightClick)
        root.setAttribute("style", "filter:brightness(" + (delta ? ++brightness : --brightness) + "%)");
      else {
        let { playbackRate } = video;
        let y = video.getBoundingClientRect().y;
        let w = innerWidth;
        modal.textContent = (video.playbackRate = delta ? min(playbackRate + .25, 5) : max(playbackRate - .25, .25)) + "x";
        ex != w && modal.attributeStyleMap.set("left", (px.value = (ex = w) / 2 - 32, px));
        ey != y && modal.attributeStyleMap.set("top", (px.value = (ey = y) + 16, px));
        modal.hidden = 0;
        clearTimeout(timer);
        timer = setTimeout(() => modal.hidden = "until-found", 1500);
      }
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
      let wrapper = document.createElement("wrapper");
      wrapper.setAttribute("style", "all:unset;display:flow;height:inherit");
      video.after(wrapper, modal);
      wrapper.appendChild(video);
      let isSkip;
      addEventListener("mousedown", e => {
        let { button } = e;
        if (button > 1) {
          let p = e.x;
          let rect = video.getBoundingClientRect();
          p <= rect.right && p >= rect.x && (p = e.y) <= rect.bottom && p >= rect.y && (
            e.stopImmediatePropagation(e.preventDefault()),
            rightClick = button == 2 || (
              video.currentTime += button < 4 ? -5 : 5,
              isSkip = 1
            )
          );
        }
      }, 1),
      addEventListener("mouseup", e => (
        isSkip = (isSkip && e.stopImmediatePropagation(e.preventDefault()), 0),
        rightClick = 0
      ), 1);
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
          let delta = e.deltaY < 0;
          if (rightClick)
            wrapper.attributeStyleMap.set("filter", CSSStyleValue.parse("filter", "brightness(" + (delta ? ++brightness : --brightness) + "%)"));
          else {
            p = video.playbackRate;
            let value = x + rect.width / 2;
            ex != value && modal.attributeStyleMap.set("left", (px.value = (ex = value) - 32, px));
            ey != y && modal.attributeStyleMap.set("top", (px.value = (ey = y) + 16, px));
            modal.textContent = (video.playbackRate = delta ? min(p + .25, 5) : max(p - .25, .25)) + "x";
            modal.hidden = 0;
            clearTimeout(timer);
            timer = setTimeout(() => modal.hidden = "until-found", 1500);
          }
        } else
          modal.hidden = "until-found";
      }, { capture: !0, passive: !1 });
    }
  }
}