{
  let d = document;
  let { fullscreenElement } = d;
  let videos = (fullscreenElement ?? d).getElementsByTagName("video");
  let videoLen = videos.length;
  let video;
  let track;
  let cue;
  let { max, min } = Math;
  let brightness = 100;
  let timer0;
  let timer1;
  let timer2;
  let rightClick;
  let onMouseHold = button => {
    if ((rightClick = button == 2) == 0) {
      let t = button = button < 4 ? -5 : 5;
      video.currentTime += t;
      timer1 = -1;
      timer0 = setTimeout(() => (
        video.currentTime += t,
        timer1 &&= setInterval(() => video.currentTime += t, 127)),
        500
      );
    }
  }
  let addCue = delta => {
    cue &&= (track.removeCue(cue), 0);
    let pbr = video.playbackRate;
    track.addCue(cue = new VTTCue(0, 65535, (video.playbackRate = (delta ? Math.min(Math.floor((pbr + .11) * 10) / 10, 5) : Math.max(Math.floor((pbr - .11) * 10) / 10, .1))) + "x"));
    clearTimeout(timer2);
    timer2 = setTimeout(() => cue &&= (track.removeCue(cue), 0), 2000);
  }
  if (videoLen == 1 && d.head.childElementCount == 1) {
    chrome.runtime.sendMessage(0);
    track = (video = videos[0]).addTextTrack("subtitles");
    track.mode = "showing";
    let root = d.documentElement;
    onkeydown = e => {
      let k = e.keyCode;
      if (k == 122 && !d.fullscreenElement)
        video.requestFullscreen(e.preventDefault())
      else {
        let t =
            k == 39 ? 5
          : k == 37 ? -5
          : k == 190 ? .03333333333333333
          : k == 188 && -.03333333333333333;
        t ? (e.preventDefault(), k > 39 && video.pause(), video.currentTime += t)
          : (t = k == 38 ? .1 : k == 40 && -.1) && (video.volume = min(max(video.volume + t, 0), 1));
      }
      return !0;
    }
    onmousedown = e => {
      let { button } = e;
      button > 1 && (
        e.preventDefault(),
        onMouseHold(button)
      )
    }
    onmouseup = () => (
      timer0 &&= clearTimeout(timer0),
      timer1 &&= clearInterval(timer1),
      rightClick = 0
    );
    onwheel = e => {
      let delta = e.deltaY < 0;
      rightClick
        ? root.setAttribute("style", "filter:brightness(" + (delta ? ++brightness : --brightness) + "%)")
        : addCue(delta)
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
    if (video ??= fullscreenElement?.shadowRoot?.querySelector("video")) {
      chrome.runtime.sendMessage(0);
      let inVideo;
      let onKeyDown = e => {
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
      }
      let onMouseDown = e => {
        let { button } = e;
        if (button > 1) {
          let p = e.x;
          let rect = video.getBoundingClientRect();
          p <= rect.right && p >= rect.x && (p = e.y) <= rect.bottom && p >= rect.y && (
            e.preventDefault(inVideo = 1),
            onMouseHold(button)
          );
        }
      }
      let onMouseUp = e => (
        timer0 &&= clearTimeout(timer0),
        timer1 &&= clearInterval(timer1),
        inVideo &&= e.preventDefault(),
        rightClick = 0
      );
      let onWheel = e => {
        let p = e.x;
        let rect = video.getBoundingClientRect();
        let { x, y } = rect;
        if (p >= x && p <= rect.right && (p = e.y) >= y && p <= rect.bottom) {
          e.stopImmediatePropagation(e.preventDefault());
          let delta = e.deltaY < 0;
          rightClick
            ? wrapper.attributeStyleMap.set("filter", CSSStyleValue.parse("filter", "brightness(" + (delta ? ++brightness : --brightness) + "%)"))
            : addCue(delta)
        }
      }
      let onRateChange = e => e.stopImmediatePropagation();
      let onFullscreenChange = () => {
        let listen = self[d.fullscreenElement ? "addEventListener" : "removeEventListener"];
        listen("keydown", onKeyDown, 1);
        listen("mousedown", onMouseDown, 1);
        listen("mouseup", onMouseUp, 1);
        listen("wheel", onWheel, { capture: !0, passive: !1 });
        listen("ratechange", onRateChange, 1);
      }
      d.addEventListener("fullscreenchange", onFullscreenChange, 1);
      onFullscreenChange();

      track = video.addTextTrack("subtitles");
      track.mode = "showing";
      let wrapper = d.createElement("wrapper");
      wrapper.setAttribute("style", "all:unset;display:flow;height:inherit");
      video.after(wrapper);
      wrapper.appendChild(video);
    }
  }
}