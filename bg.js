chrome.runtime.onUserScriptMessage.addListener((_, s) => {
  let tabId = s.tab.id;
  chrome.action.disable(tabId);
  chrome.action.setIcon({
    tabId,
    path: "on.png"
  });
  chrome.action.setTitle({
    tabId,
    title: " "
  });
});
{
  let e = (a, b) => {
    let { id: tabId } = b || a;
    chrome.action.getTitle({ tabId }, async title => {
      try {
        title == "kbdvid" &&
        await chrome.userScripts.execute({
          target: { tabId, allFrames: !0 },
          js: [{ file: "main.js" }]
        });
      } catch {}
    })
  }
  chrome.action.onClicked.addListener(e);
  chrome.contextMenus.onClicked.addListener(e);
  let f = () => {
    let { userScripts } = chrome;
    userScripts &&
    userScripts.getScripts(scripts =>
      scripts.length || (
        userScripts.configureWorld({ messaging: !0 }),
        userScripts.register([{
          id: "0",
          js: [{ file: "main.js" }],
          matches: ["https://*/*.mp4*", "file://*.mp4*"],
          runAt: "document_end"
        }]),
        chrome.runtime.onStartup.removeListener(f) 
      )
    );
  }
  chrome.runtime.onStartup.addListener(f);
  chrome.runtime.onInstalled.addListener(() => (
    chrome.contextMenus.create({
      id: "",
      title: "Enable kbdvid",
      contexts: ["page", "frame", "video"],
      documentUrlPatterns: ["https://*/*"]
    }),
    f()
  ));
}