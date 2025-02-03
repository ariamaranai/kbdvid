{
  let run = async (a, b) => {
    let url = (b || a).url;
    if (url[0] != "c" && url.slice(8, 23) != "www.youtube.com") {
      let tabId = (b || a).id;
      let isEnable = await chrome.action.getTitle({ tabId }) == "Disable stepvf";
      chrome.action.setIcon({
        tabId,
        path: isEnable ? "off.png" : "on.png"
      });
      chrome.action.setTitle({ tabId, title: isEnable ?  "Enable stepvf" : "Disable stepvf" });
      chrome.scripting.executeScript({
        target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
        world: (await chrome.contentSettings.javascript.get({
          primaryUrl: url
        })).setting == "allow" ? "MAIN" : "ISOLATED",
        args: [isEnable ? "removeEventListener" : "addEventListener"],
        func: el => {
          let href;
          let video;
          let f = e => {
            e.stopImmediatePropagation();
            let k = e.key;
            let t = k == "." ? 0.016666666666666666 : k == "," && -0.016666666666666666
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
          self[el]("keydown", f);
        } 
      })
    }
  }
  chrome.action.setTitle({ title: "stepvf" });
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