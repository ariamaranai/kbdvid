chrome.runtime.onUserScriptMessage.addListener((m, s) => {
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
  let f = a => {
    let { id: tabId } = a;
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
  chrome.action.onClicked.addListener(f);
  chrome.windows.onBoundsChanged.addListener(window =>
    window.state == "fullscreen" &&
    chrome.tabs.query({ active: !0, audible: !0, windowId: window.id }, tabs => {
      tabs.length && f(tabs[0]);
    })
  );
  let onStartup = () => {
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
        chrome.runtime.onStartup.removeListener(onStartup) 
      )
    );
  }
  chrome.runtime.onStartup.addListener(onStartup);
  chrome.runtime.onInstalled.addListener(onStartup);
}