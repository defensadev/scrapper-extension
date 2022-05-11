import { $ } from "../extension-src/utils";
import Odyssey from "./Odyssey";
import UI from "./UI";
import { onReadyState, state } from "./state";

const renderPage = async (err: Error | null) => {
  const rootEl = $("root");

  try {
    const { county, caseNumber } = state;
    if (!county || !caseNumber || err) {
      throw err;
    }

    const loadingNode = document.createElement("div");
    loadingNode.className = "m-4 font-extrabold text-gray-700";
    loadingNode.innerText = "Loading...";
    rootEl.innerHTML = "";
    rootEl.appendChild(loadingNode);

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
    if (err.message === "prevState") {
      return;
    }

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
  const countyEl = $<HTMLInputElement>("county");

  caseNumberEl.onblur = () => renderPage(UI());
  countyEl.onblur = () => renderPage(UI());

  caseNumberEl.onkeydown = (ev) => {
    ev.key === "Enter" && caseNumberEl.blur();
  };
  countyEl.onkeydown = (ev) => {
    ev.key === "Enter" && caseNumberEl.value.length > 0 && countyEl.blur();
  };

  renderPage(UI());
};

onReadyState().then(() => main());
