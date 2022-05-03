import { openNewTab, getIsActive } from "./utils";

// @ts-ignore
chrome.commands.onCommand.addListener((command: string) => {
  console.log("got command", command);
  if (command === "case-number-search") {
    getIsActive().then((isActive) => {
      if (!isActive) {
        return;
      }
      // @ts-ignore
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // @ts-ignore
        chrome.tabs.sendMessage(
          tabs[0].id,
          "selectionText",
          (caseNumber: string) => {
            caseNumber && openNewTab({ caseNumber });
          }
        );
      });
    });
  }
});

// @ts-ignore
chrome.runtime.onInstalled.addListener(() => {
  // @ts-ignore
  chrome.contextMenus.create({
    title: "Scrapper: %s",
    contexts: ["selection"],
    id: "scrapper-shortcut",
  });
});

// @ts-ignore
chrome.contextMenus.onClicked.addListener((info: any) => {
  openNewTab({ caseNumber: info.selectionText });
});
