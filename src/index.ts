import { $ } from "../extension-src/utils";
import Odyssey from "./Odyssey";

interface Counties {
  [key: string]: RegExp;
}

const counties: Counties = {
  harris: /^[0-9]+$/,
  tarrant: /^JP[0-9]+-[0-9]+-E.+$/,
  fortbend: /^[0-9]+-JEV[0-9]+-[0-9]+$/,
};

const getCounty = (caseNumber: string): string => {
  const countyEl = $<HTMLInputElement>("county");
  if (countyEl.value) {
    return countyEl.value.toLowerCase();
  }
  for (const county in counties) {
    const re = counties[county];
    if (re.test(caseNumber)) {
      return county;
    }
  }

  throw new Error(`Could not recognize county for case number ${caseNumber}`);
};

const state = {
  caseNumber: "",
  county: "",
};

const renderPage = async () => {
  const caseNumber = $<HTMLInputElement>("case-number").value;
  if (!caseNumber) {
    return;
  }
  const rootEl = $("root");

  try {
    const county = getCounty(caseNumber);
    if (county === state.county && caseNumber === state.caseNumber) {
      return;
    }
    state.caseNumber = caseNumber;
    state.county = county;
    history.pushState({}, "", `?caseNumber=${caseNumber}&county=${county}`);

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
  caseNumberEl.onblur = () => renderPage();
  caseNumberEl.onkeydown = (ev) => {
    ev.key === "Enter" && caseNumberEl.blur();
  };
  const countyEl = $<HTMLInputElement>("county");
  countyEl.onblur = () => renderPage();
  countyEl.onkeydown = (ev) => {
    ev.key === "Enter" && caseNumberEl.value.length > 0 && countyEl.blur();
  };

  const caseNumber = new URLSearchParams(window.location.search).get(
    "caseNumber"
  );
  if (!caseNumber) {
    return;
  }
  caseNumberEl.value = caseNumber;

  renderPage();
};

main();
