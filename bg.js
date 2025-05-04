{
  let run = (a, b) => {
    if ((b || a).url.slice(8, 23) != "www.youtube.com") {
      let tabId = (b || a).id;
      chrome.action.isEnabled(tabId, isEnabled =>
        chrome.userScripts.execute({
          target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
          js: [{ code: 
`{
  let video;
  let d = document;
  addEventListener("mouseup", e => e.button == 3 && d.fullscreenElement &&
    d.exitFullscreen(e.stopImmediatePropagation(e.preventDefault())),
    1
  );
  addEventListener("keydown", e => {
    let k = e.keyCode;
    let t =
        k == 39 ? 5
      : k == 37 ? -5
      : k == 190 ? .03333333333333333
      : k == 188 ? -.03333333333333333
      : k == 122 && !d.fullscreenElement;
    if (t) {
      if (!video) {
        let videos = d.body.getElementsByTagName("video");
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
  }, 1);
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
chrome.runtime.onMessageExternal.addListener(async tabId => {
  chrome.userScripts.execute({
    target: { tabId },
    js: [{ file: "main.js" }]
  })
  return !0;
});
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ file: "main.js" }],
    matches: ["file://*.mp4", "https://video.twimg.com/*", "https://v16-webapp-prime.tiktok.com/*", "https://jra.webcdn.stream.ne.jp/web/jra/*"],
    runAt: "document_end"
  }]),
  chrome.contextMenus.create({
    id: "",
    title: "Enable keyboard shortcuts for video",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*"]
  })
));