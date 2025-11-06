chrome.runtime.onUserScriptMessage.addListener((m, s, r) => {
  m ?? chrome.system.display.getInfo(infos => r(infos[0].bounds));
  let tabId = s.tab.id;
  let title = " ";
  chrome.action.disable(tabId);
  chrome.action.setIcon({ tabId, path: m ? (title = "kbdvid", "off.png") : "on.png" });
  chrome.action.setTitle({ tabId, title });
  return !0;
});
{
  let actionOnClicked = a => {
    let tabId = a.id;
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
  chrome.action.onClicked.addListener(actionOnClicked);
  chrome.windows.onBoundsChanged.addListener(window =>
    window.state == "fullscreen" &&
    chrome.tabs.query({ active: !0, windowId: window.id }, tabs =>
      tabs.length && actionOnClicked(tabs[0])
    )
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