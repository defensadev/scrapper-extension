// @ts-ignore
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request === "selectionText") {
    const selectionText = window.getSelection();
    const caseNumber = selectionText ? selectionText.toString() : "";
    sendResponse(caseNumber);
  }
});
