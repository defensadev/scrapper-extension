import { $, getIsActive, openNewTab, setIsActive } from "./utils";

const updateSwitch = (active: boolean) => {
  const switchEl = $("switch");
  if (active) {
    switchEl.classList.remove("bg-slate-300");
    switchEl.classList.add("bg-indigo-600");
    switchEl.classList.add("justify-end");
  } else {
    switchEl.classList.add("bg-slate-300");
    switchEl.classList.remove("bg-indigo-600");
    switchEl.classList.remove("justify-end");
  }
};

const main = async () => {
  const inputEl = $<HTMLInputElement>("input");
  inputEl.onkeydown = (ev) => {
    if (ev.key === "Enter") {
      inputEl.blur();
      openNewTab({ caseNumber: inputEl.value });
    }
  };

  const buttonEl = $("btn");
  let page: "caseNumberSearch" | "commonTexts" = "caseNumberSearch";
  buttonEl.addEventListener("click", () => {
    const caseNumberSearchEl = $("case-number-search");
    const commonTextsEl = $("common-texts");
    const caseNumberSearchBtn = $("case-number-search-btn");
    const commonTextsBtn = $("common-texts-btn");
    page = page === "caseNumberSearch" ? "commonTexts" : "caseNumberSearch";

    if (page === "caseNumberSearch") {
      caseNumberSearchEl.classList.remove("hidden");
      commonTextsEl.classList.add("hidden");
      caseNumberSearchBtn.classList.add("bg-indigo-600", "text-white");
      commonTextsBtn.classList.remove("bg-indigo-600", "text-white");
      return;
    }
    caseNumberSearchEl.classList.add("hidden");
    commonTextsEl.classList.remove("hidden");
    caseNumberSearchBtn.classList.remove("bg-indigo-600", "text-white");
    commonTextsBtn.classList.add("bg-indigo-600", "text-white");
  });

  const switchEl = $("switch");
  let active = await getIsActive();
  switchEl.addEventListener("click", () => {
    active = !active;
    updateSwitch(active);
    setIsActive(active);
  });
  updateSwitch(active);
};

main();
