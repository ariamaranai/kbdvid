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
let f = e => {
  let k = e.key;
  let t = k == "." ? .03333333333333333 : k == "," && -.03333333333333333;
  if (t) {
    let _href = location.href;
    if (!(_href == href || (video && video.checkVisibility()))) {
      href = _href;
      let videos = document.body.getElementsByTagName("video");
      let i = videos.length;
      if (i) {
        let index = 0;
        if (i > 1) {
          let maxWidth = 0;
          let width = 0;
          while (
            maxWidth < (width = videos[--i].offsetWidth) && (maxWidth = width, index = i),
            i
          );
        }
        video = videos[index];
      }
    }
    video && (video.paused || video.pause(), video.currentTime += t);
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
    js: [{ code: '{let v=document.querySelector("video");v&&(chrome.runtime.sendMessage(0),onkeydown=e=>{let k=e.key,t=k=="."?.03333333333333333:k==","&&-.03333333333333333;t&&(v.paused||v.pause(),v.currentTime+=t)})}'}],
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