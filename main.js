chrome.runtime.sendMessage(0);
{
  let d = document;
  let videos = d.getElementsByTagName("video");
  let videoLen = videos.length;
  let video;
  let track;
  let cue;
  let { max, min } = Math;
  let brightness = 100;
  let timer = 0;
  let rightClick = 0;
  let addCue = delta => {
    let { playbackRate } = video;
    cue &&= (track.removeCue(cue), 0);
    track.addCue(cue = new VTTCue(0, 65535, (video.playbackRate = delta < 0 ? min(playbackRate + .25, 5) : max(playbackRate - .25, .25)) + "x"));
    clearTimeout(timer);
    timer = setTimeout(() => cue &&= (track.removeCue(cue), 0), 2000);
  }
  if (videoLen == 1 && d.head.childElementCount == 1) {
    track = (video = videos[0]).addTextTrack("subtitles");
    track.mode = "showing";
    let root = d.documentElement;
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
    onwheel = e =>
      rightClick
        ? root.setAttribute("style", "filter:brightness(" + (delta ? ++brightness : --brightness) + "%)")
        : addCue(e.deltaY);

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
      track = video.addTextTrack("subtitles");
      track.mode = "showing";
      let wrapper = document.createElement("wrapper");
      wrapper.setAttribute("style", "all:unset;display:flow;height:inherit");
      video.after(wrapper);
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
        p >= x && p <= rect.right && (p = e.y) >= y && p <= rect.bottom && (
          e.stopImmediatePropagation(e.preventDefault()),
          rightClick
            ? wrapper.attributeStyleMap.set("filter", CSSStyleValue.parse("filter", "brightness(" + (delta ? ++brightness : --brightness) + "%)"))
            : addCue(e.deltaY)
        );
      }, { capture: !0, passive: !1 });
    }
  }
}