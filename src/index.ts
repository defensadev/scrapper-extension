import { $ } from "../extension-src/utils";
import Odyssey from "./Odyssey";

const getParams = () => {
  return new URLSearchParams(window.location.search);
};

const getCounty = (caseNumber: string): string => {
  const countyEl = $<HTMLInputElement>("county");
  if (countyEl.value) {
    return countyEl.value.toLowerCase();
  }
  if (/^[0-9]+$/.test(caseNumber)) {
    return "harris";
  }
  if (/^JP[0-9]+-[0-9]+-E.+$/.test(caseNumber)) {
    return "tarrant";
  }

  throw new Error(`Could not recognize county for case number ${caseNumber}`);
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

  try {
    const county = getCounty(caseNumber);

    const url = `https://ihaucbf8v2.execute-api.us-east-1.amazonaws.com/${county}?caseNumber=${caseNumber}`;
    const res = await fetch(url).then(async (res) => {
      const text = await res.text();
      if (res.status !== 200) {
        throw new Error(text);
      }
      return text;
    });
    const html = res.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    const odyssey = document.createElement("odyssey-html");
    // @ts-ignore
    odyssey.odysseyHTML = html;

    rootEl.innerHTML = "";
    rootEl.appendChild(odyssey);
  } catch (err) {
    const errEl = document.createElement("p");
    errEl.className = "text-red-500";
    errEl.innerText = err.message;

    rootEl.innerHTML = "";
    rootEl.appendChild(errEl);
  }
};

const main = () => {
  customElements.define("odyssey-html", Odyssey);

  const caseNumberEl = $<HTMLInputElement>("case-number");
  caseNumberEl.onkeydown = (ev) => {
    ev.key === "Enter" && renderPage();
  };
  const countyEl = $<HTMLInputElement>("county");
  countyEl.onkeydown = (ev) => {
    ev.key === "Enter" && caseNumberEl.value.length > 0 && renderPage();
  };

  const caseNumber = getParams().get("caseNumber");
  if (!caseNumber) {
    return;
  }
  caseNumberEl.value = caseNumber;

  renderPage();
};

main();
