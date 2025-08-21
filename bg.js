chrome.action.onClicked.addListener(async a => {
  try {
    await chrome.userScripts.execute({
      target: { tabId: a.id, allFrames: !0 },
      js: [{ file: "main.js" }]
    })
  } catch {}
});
chrome.runtime.onUserScriptMessage.addListener((_, s) => {
  let tabId = s.tab.id;
  chrome.action.disable(tabId);
  chrome.action.setIcon({
    tabId,
    path: "on.png"
  });
});
{
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
  chrome.runtime.onInstalled.addListener(f);
}