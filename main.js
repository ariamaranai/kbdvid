{
  let d = document;
  let video = 0;
  let track;
  let { max, min } = Math;
  let getVideo = () => {
    video = d.fullscreenElement || d.scrollingElement;
    if (video?.tagName != "VIDEO") {
      let videos = video.getElementsByTagName("VIDEO");
      let maxVisibleSize = 0;
      let i = 0;
      while (i < videos.length) {
        let _video = videos[i];
        if (_video.readyState) {
          let rect = _video.getBoundingClientRect();
          let visibleSize = max(min(rect.right, innerWidth) - max(rect.x, 0), 0) * max(min(rect.bottom, innerHeight) - max(rect.y, 0), 0);
          maxVisibleSize < visibleSize && (
            maxVisibleSize = visibleSize,
            video = _video
          );
        }
        ++i;
      }
      video?.readyState || (video = video.shadowRoot?.querySelector("VIDEO"))?.readyState || (video = 0);
    } else
      video.readyState || (video = 0);
    video && ((track = video.addTextTrack("subtitles")).mode = "showing");
  }
  getVideo();
  if (video) {
    let cue;
    let brightness = 100;
    let contrast = 100;
    let filterValue = new CSSUnparsedValue([0]);
    let timer0;
    let timer1;
    let timer2;
    let rightClick;
    let showContextMenu;
    let onContextMenu = e => showContextMenu || e.stopImmediatePropagation(e.preventDefault());
    let onMouseDown = e => {
      let button = e.button;
      button > 1 && (
        e.preventDefault(),
        onMouseHold(button)
      );
    }
    let onMouseUp = e => (
      e.button > 2 && e.preventDefault(),
      timer0 &&= clearTimeout(timer0),
      timer1 &&= clearInterval(timer1),
      rightClick &&= (showContextMenu = performance.now() - rightClick < 300, 0)
    );
    let onMouseHold = button => {
      if ((rightClick = button == 2 && performance.now()) == 0) {
        let t = video.playbackRate * (button < 4 ? -5 : 5);
        video.currentTime += t;
        timer1 = -1;
        timer0 = setTimeout(() => (
          video.currentTime += t,
          timer1 &&= setInterval(() => video.currentTime += t, 127)),
          500
        );
      }
    }
    let onWheel = e => {
      try {
        e.preventDefault();
      } catch {}
      e.stopImmediatePropagation();
      let delta = Math.sign(e.deltaY);
      rightClick
        ? video.attributeStyleMap.set("filter", (filterValue[0] = "brightness(" + (brightness -= delta) + "%) contrast(" + (contrast += delta) + "%)", filterValue))
        : addCue(delta);
    }
    let addCue = delta => {
      cue &&= (track.removeCue(cue), 0);
      let pbr = video.playbackRate;
      let floor= Math.floor;
      track.addCue(cue = new VTTCue(0, 2147483647, (video.playbackRate = (delta < 0 ? min(floor((pbr + .055) * 20) / 20, 5) : max(floor((pbr - .055) * 20) / 20, .1))) + "x"));
      clearTimeout(timer2);
      timer2 = setTimeout(() => cue &&= (track.removeCue(cue), 0), 2000);
    }
    if (d.head?.childElementCount == 1) {
      chrome.runtime.sendMessage(0);
      oncontextmenu = onContextMenu;
      onkeydown = e => {
        let k = e.keyCode;
        if (k == 122 && !d.fullscreenElement)
          video.requestFullscreen(e.preventDefault());
        else {
          let t =
              k == 39 ? video.playbackRate * 5
            : k == 37 ? video.playbackRate * -5
            : k == 190 ? .03333333333333333
            : k == 188 && -.03333333333333333;
          t ? (e.preventDefault(), k > 39 && video.pause(), video.currentTime += t)
            : (t = k == 38 ? .1 : k == 40 && -.1) && (video.volume = min(max(video.volume + t, 0), 1));
        }
        return !0;
      }
      onmousedown = onMouseDown;
      onmouseup = onMouseUp;
      onwheel = onWheel;
    } else {
      chrome.runtime.sendMessage(null, ({ width: fullscreenWidth, height: fullscreenHeight }) => {
        let onKeyDown = e => {
          let k = e.keyCode;
          let t = k == 39 ? video.playbackRate * 5
                : k == 37 ? video.playbackRate * -5
                : k == 190 ? .03333333333333333
                : k == 188 && -.03333333333333333;
          return !t || (
            e.stopImmediatePropagation(e.preventDefault()),
            k > 39 && video.pause(),
            video.currentTime += t
          )
        }
        let onRateChange = e => e.stopImmediatePropagation();
        let listener;
        let observer = new ResizeObserver(() => {
          (listener =
            listener == addEventListener
              ? (video = observer.unobserve(video), chrome.runtime.sendMessage(1), removeEventListener)
              : (!listener || innerWidth == fullscreenWidth && innerHeight == fullscreenHeight)
                && (video || getVideo(), video && observer.observe(video), addEventListener)) &&
          video != 0 && (
            listener("contextmenu", onContextMenu, 1),
            listener("keydown", onKeyDown, 1),
            listener("mousedown", onMouseDown, 1),
            listener("mouseup", onMouseUp, 1),
            listener("wheel", onWheel, { capture: !0, passive: !1 }),
            listener("ratechange", onRateChange, 1)
          );
        });
        observer.observe(video);
      });
    }
  }
}