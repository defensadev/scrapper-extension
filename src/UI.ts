import { state, counties, prevState } from "./state";
import { $ } from "../extension-src/utils";

const getParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlCaseNumber = urlParams.get("caseNumber");
  const urlCounty = urlParams.get("county");

  if (urlCaseNumber) {
    state.caseNumber = urlCaseNumber;
  }
  if (urlCounty) {
    state.county = urlCounty;
  }
};

const syncParams = () => {
  if (state.caseNumber || state.county) {
    // @ts-ignore
    const pms = new URLSearchParams(state).toString();
    history.pushState({}, "", "?" + pms);
  }
};

const getInputs = () => {
  const caseNumberEl = $<HTMLInputElement>("case-number");
  const countyEl = $<HTMLInputElement>("county");
  if (countyEl.value) {
    state.county = countyEl.value.toLowerCase();
  }
  if (caseNumberEl.value) {
    state.caseNumber = caseNumberEl.value;
  }
};

const syncInputs = () => {
  const caseNumberEl = $<HTMLInputElement>("case-number");
  const countyEl = $<HTMLInputElement>("county");
  countyEl.value = state.county ? state.county : countyEl.value;
  caseNumberEl.value = state.caseNumber ? state.caseNumber : caseNumberEl.value;
};

const getCounty = (caseNumber: string): string | undefined => {
  for (const county in counties) {
    const re = counties[county];
    if (re.test(caseNumber)) {
      return county;
    }
  }
  return undefined;
};

const UI = (): Error | null => {
  getParams();
  getInputs();
  syncParams();
  syncInputs();
  state.county = state.county
    ? state.county
    : state.caseNumber && getCounty(state.caseNumber);

  if (state.county && state.caseNumber) {
    if (
      prevState.caseNumber === state.caseNumber &&
      prevState.county === state.county
    ) {
      return new Error("prevState");
    }
    prevState.caseNumber = state.caseNumber;
    prevState.county = state.county;
    return null;
  }
  if (!state.county) {
    return new Error(
      `couldn't infer county from case number: "${state.caseNumber}"`
    );
  }
  return new Error("no case number provided couldn't preform autosearch");
};

export default UI;
