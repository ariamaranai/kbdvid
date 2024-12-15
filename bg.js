(chrome => {
  let run = (a, b) => {
    let url = (b || a).url;
    url[0] != "c" &&
    url.slice(8, 23) != "www.youtube.com" &&
    chrome.scripting.executeScript({
      target: b ?
      { tabId: b.id, frameIds: [a.frameId] } :
      { tabId: a.id },
      world: "MAIN",
      func: () => {
        let href;
        let video;
        let keydownHandler = e => {
          e.stopImmediatePropagation();
          let k = e.key;
          let t = k == "." ? 0.016666666666666666 : k == "," ? -0.016666666666666666 : 0;
          if (t) {
            let _href = location.href;
            if (!(_href == href || (video && video.checkVisibility()))) {
              href = _href;
              let videos = document.getElementsByTagName("video");
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
            if (video) {
              video.paused || video.pause();
              video.currentTime += t;
            }
          };
        }
        removeEventListener("keydown", keydownHandler);
        addEventListener("keydown", keydownHandler);
      }
    });
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.runtime.onInstalled.addListener(() =>
    chrome.contextMenus.create({
      id: "",
      title: "Enable stepvf",
      contexts: ["page", "video"]
    })
  );
})(chrome)