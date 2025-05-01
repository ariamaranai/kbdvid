{
  let run = (a, b) => {
    if ((b || a).url.slice(8, 23) != "www.youtube.com") {
      let tabId = (b || a).id;
      chrome.action.isEnabled(tabId, isEnabled =>
        isEnabled && chrome.userScripts.execute({
          target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
          js: [{ code:
`{
let href;
let video;
let { body } = document;
let f = e => {
  let k = e.keyCode;
  let t =
      k == 39 ? 5
    : k == 37 ? -5
    : k == 190 ? .03333333333333333
    : k == 188 ? -.03333333333333333
    : k == 122 && e.target == body && !document.fullscreenElement;
  if (t) {
    let _href = location.href;
    if (!(_href == href || video)) {
      href = _href;
      let videos = body.getElementsByTagName("video");
      let i = videos.length;
      if (i) {
        let index = 0;
        let maxWidth = 0;
        let width = 0;
        while (
          maxWidth < (width = videos[--i].offsetWidth) && (maxWidth = width, index = i),
          i
        );
        video = videos[index];
      }
    }
    video && (
      e.preventDefault(),
      t != !0
        ? (video.pause(), video.currentTime += t)
        : video.requestFullscreen()
    );
  }
}
addEventListener("keydown", f, 1);
}`
            }]
          }).then(() => (
            chrome.action.disable(tabId),
            chrome.action.setIcon({
              tabId,
              path: "on.png"
            })
          )).catch(() => 0)
      )
    }
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
}
chrome.runtime.onUserScriptMessage.addListener((_, s) => {
  let tabId = s.tab.id;
  chrome.action.disable(tabId);
  chrome.action.setIcon({
    tabId,
    path: "on.png"
  });
});
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ code:
`{
  let video = document.body.querySelector("video");
  video && (
    chrome.runtime.sendMessage(0),
    onkeydown = e => {
      let k = e.keyCode;
      let t =
          k == 39 ? 5
        : k == 37 ? -5
        : k == 190 ? .03333333333333333
        : k == 188 ? -.03333333333333333
        : k == 122 && e.target != video && !document.fullscreenElement;
      t && (
        e.preventDefault(),
        t != !0
          ? (video.pause(), video.currentTime += t)
          : video.requestFullscreen()
      );
    }
  );
}`}],
    matches: ["file://*.mp4", "https://jra.webcdn.stream.ne.jp/web/jra/*", "https://video.twimg.com/*", "https://v16-webapp-prime.tiktok.com/*"],
    runAt: "document_end"
  }]),
  chrome.contextMenus.create({
    id: "",
    title: "Stepvf",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*"]
  })
));