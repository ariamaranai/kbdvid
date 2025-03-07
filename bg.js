{
  let run = async (a, b) => {
    let tabId = (b || a).id;
    let isEnabled = await chrome.action.getTitle({ tabId }) == "Disable stepvf";
    chrome.scripting.executeScript({
      target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
      args: [isEnabled ? "removeEventListener" : "addEventListener"],
      func: el => {
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
                    maxWidth < (width = video[--i].offsetWidth) && (maxWidth = width, index = i),
                    i
                  );
                }
                video = videos[index];
              }
            }
            video && (video.paused || video.pause(), video.currentTime += t);
          }
        }
        self[el]("keydown", f, 1);
      }
    }).then(() => (
      chrome.action.setIcon({ tabId, path: isEnabled ? "off.png" : "on.png" }),
      chrome.action.setTitle({ tabId, title: isEnabled ?  "Enable stepvf" : "Disable stepvf" })
    )).catch(() => 0);
  }
  chrome.action.setTitle({ title: "Enable stepvf" });
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "stepvf",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*", "https://*/", "http://*/*", "http://*/", "file://*/*", "file://*/"]
  })
);