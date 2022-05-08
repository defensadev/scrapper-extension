import { $ } from "../extension-src/utils";
import Odyssey from "./Odyssey";

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
  const html = res.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  const odyssey = document.createElement("odyssey-html");
  // @ts-ignore
  odyssey.odysseyHTML = html;
  rootEl.innerHTML = "";
  rootEl.appendChild(odyssey);
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

  customElements.define("odyssey-html", Odyssey);

  renderPage();
};

main();
