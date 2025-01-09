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
      chrome.action.setTitle({
        tabId,
        title: isEnable ? "Enable stepvf" : "Disable stepvf"
      });
      chrome.contextMenus.update("", {
        title: isEnable ? "Enable stepvf" : "Disable stepvf"
      });
      chrome.scripting.executeScript({
        target: b ? { tabId, frameIds: [a.frameId] } : { tabId },
        world: "MAIN",
        args: [isEnable],
        func: isEnable => {
          let href;
          let video;
          let stepvf = e => {
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
                  let maxWidth = 0;
                  let width = 0;
                  let index = 0;
                  while (
                    width < (width = videos[--i].offsetWidth) && (maxWidth = width, index = i),
                    i
                  );
                  video = videos[index];
                }
              }
              video && (video.paused || video.pause(), video.currentTime += t);
            }
          }
          self[isEnable ? "removeEventListener" : "addEventListener"]("keydown", stepvf);
        } 
      })
    }
  }
  chrome.action.setTitle({ title: "Enable stepvf" });
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Enable stepvf",
    contexts: ["page", "video"],
    documentUrlPatterns: ["https://*/*", "https://*/", "http://*/*", "http://*/", "file://*/*", "file://*/"]
  })
);