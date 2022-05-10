(() => {
  // extension-src/utils.ts
  var $ = (id) => {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`expected element with id: "${id}"`);
    }
    return el;
  };
  var openNewTab = (props) => {
    const url = `https://scrapper-extension.netlify.app?caseNumber=${props.caseNumber}`;
    chrome.tabs.create({ url });
  };
  var getIsActive = async () => {
    return new Promise((res) => {
      chrome.storage.local.get(["scrapper-extension-is-active"], (resp) => {
        if (!resp) {
          res(false);
          return;
        }
        try {
          const v = JSON.parse(resp["scrapper-extension-is-active"]);
          res(!!v);
        } catch {
          res(false);
        }
      });
    }).then((res) => {
      return res;
    });
  };
  var setIsActive = (value) => {
    return new Promise((res) => {
      chrome.storage.local.set({ "scrapper-extension-is-active": value }, () => res(null));
    });
  };

  // src/Odyssey.ts
  var Odyssey = class extends HTMLElement {
    constructor() {
      super();
      this.odysseyHTML = "";
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      this.shadow.innerHTML = this.odysseyHTML;
      const els = this.shadow.querySelectorAll(".loadingmessagediv");
      for (let i = 0; i < els.length; i++) {
        els[i].remove();
      }
    }
  };
  var Odyssey_default = Odyssey;

  // src/index.ts
  var getParams = () => {
    return new URLSearchParams(window.location.search);
  };
  var getCounty = (caseNumber) => {
    const countyEl = $("county");
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
  var renderPage = async () => {
    const caseNumber = $("case-number").value;
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
      const res = await fetch(url).then(async (res2) => {
        const text = await res2.text();
        if (res2.status !== 200) {
          throw new Error(text);
        }
        return text;
      });
      const html = res.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      const odyssey = document.createElement("odyssey-html");
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
  var main = () => {
    customElements.define("odyssey-html", Odyssey_default);
    const caseNumberEl = $("case-number");
    caseNumberEl.onkeydown = (ev) => {
      ev.key === "Enter" && renderPage();
    };
    const countyEl = $("county");
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
})();
