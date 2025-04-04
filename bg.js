{
  let run = (a, b) => {
    if (b || !(a.url[0] == "f" && a.url.endsWith(".mp4"))) {
      let tabId = (b || a).id;
      chrome.action.getTitle({ tabId }, title => {
        let isEnabled = title == "Disable stepvf";
        chrome.userScripts.execute({
          target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
          js: [{ code:
`{
let href;
let video;
let f = e => {
  e.stopImmediatePropagation();
  let k = e.key;
  let t = k == "." ? .016666666666666666 : k == "," && -.016666666666666666;
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
self[${isEnabled ? '"removeEventListener"' : '"addEventListener"'}]("keydown", f, 1)         
}`
          }]
        }).then(() => (
          chrome.action.setIcon({ tabId, path: isEnabled ? "off.png" : "on.png" }),
          chrome.action.setTitle({ tabId, title: isEnabled ?  "Enable stepvf" : "Disable stepvf" })
        )).catch(() => 0);
      });
    }
  }
  chrome.action.setTitle({ title: "Enable stepvf" });
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
}
chrome.runtime.onUserScriptMessage.addListener((_, s, $) =>
  chrome.action.setIcon({
    tabId: s.tab.id,
    path: "on.png"
  })
);
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ code: '{let v=document.querySelector("video");v&&(chrome.runtime.sendMessage(0),onkeydown=e=>{let k=e.key,t=k=="."?.016666666666666666:k==","&&-.016666666666666666;t&&(v.paused||v.pause(),v.currentTime+=t)})}'}],
    matches: ["file://*.mp4"],
    runAt: "document_end"
  }]),
  chrome.contextMenus.create({
    id: "",
    title: "Stepvf",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*"]
  })
));