chrome.contextMenus.onClicked.addListener((a, b) =>
  b.url[0] != "c" && b.url.slice(8, 23) != "www.youtube.com" && chrome.scripting.executeScript({
    target: {tabId: b.id, frameIds: [a.frameId]},
    world: "MAIN",
    func: ()=> {
      let u, v, f =e=> {
        e.stopImmediatePropagation()
        let k = e.key, n = k == "." ? .016666666666666666 : k == "," ? -.016666666666666666 : 0
        if (n) {
          let h = location.href
          if (!(u == h || v && v.checkVisibility()))
            if (u = h, h = (v = document.getElementsByTagName("video")).length) {
              let w = 0, t = 0
              while (w < (t = v[--h].offsetWidth) && (w = t, k = h), h);
              v = v[k]
            }
          v && (v.paused || v.pause(), v.currentTime += n)
        }}
        removeEventListener("keydown", f)
        addEventListener("keydown", f)
    }
  })
)
chrome.runtime.onInstalled.addListener(()=> chrome.contextMenus.create({id: "", title: "Enable stepvf", contexts: ["page","video"]}))
