import * as sanitizeHtml from "sanitize-html";
import { $ } from "../extension-src/utils";

const getParams = () => {
  return new URLSearchParams(window.location.search);
};

const renderPage = async () => {
  const caseNumber = $<HTMLInputElement>("case-number").value;
  if (!caseNumber) {
    return;
  }
  const rootEl = $("root");
  rootEl.innerHTML = "";

  const loadingNode = document.createElement("div");
  loadingNode.className = "m-4 font-extrabold text-gray-700";
  loadingNode.innerText = "Loading...";
  rootEl.appendChild(loadingNode);

  const url = `https://ihaucbf8v2.execute-api.us-east-1.amazonaws.com/harris?caseNumber=${caseNumber}`;
  const res = await fetch(url).then((res) => res.text());
  const html = sanitizeHtml.default(res);

  const dom = new DOMParser().parseFromString(html, "text/html");
  rootEl.innerHTML = "";
  rootEl.appendChild(dom.body);
};

const main = () => {
  const caseNumberEl = $<HTMLInputElement>("case-number");
  caseNumberEl.onkeydown = (ev) => {
    ev.key === "Enter" && renderPage();
  };

  const caseNumber = getParams().get("caseNumber");
  if (!caseNumber) {
    return;
  }
  caseNumberEl.value = caseNumber;

  renderPage();
};

main();
