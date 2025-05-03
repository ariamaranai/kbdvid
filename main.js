{
  let video = document.body.querySelector("video");
  video?.name &&= (
    chrome.runtime.sendMessage(0),
    onkeydown = e => {
      let k = e.keyCode;
      let t =
          k == 39 ? 5
        : k == 37 ? -5
        : k == 190 ? .03333333333333333
        : k == 188 ? -.03333333333333333
        : k == 122 && !document.fullscreenElement;
      t && (
        e.preventDefault(),
        t != !0
          ? (video.pause(), video.currentTime += t)
          : video.requestFullscreen()
      );
    },
    ""
  );
}