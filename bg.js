chrome.action.onClicked.addListener(a =>
  a.url.slice(11, 20) != ".youtube." &&
  chrome.userScripts.execute({
    target: { tabId: a.id, allFrames: !0 },
    js: [{ file: "main.js" }]
  }).catch(() => 0)
);
chrome.runtime.onUserScriptMessage.addListener((_, s) => {
  let tabId = s.tab.id;
  chrome.action.disable(tabId);
  chrome.action.setIcon({
    tabId,
    path: "on.png"
  });
});
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.userScripts.register([{
    id: "0",
    js: [{ file: "main.js" }],
    matches: ["*://*/*.mp4*"],
    runAt: "document_end"
  }])
));