export const $ = <T = HTMLDivElement>(id: string) => {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`expected element with id: "${id}"`);
  }
  return el as unknown as T;
};

export interface OpenNewTabProps {
  caseNumber: string;
}

export const openNewTab = (props: OpenNewTabProps) => {
  const url = `https://scrapper-extension.netlify.app?caseNumber=${props.caseNumber}`;
  // @ts-ignore
  chrome.tabs.create({ url });
};

export const getIsActive = async (): Promise<boolean> => {
  return new Promise<boolean>((res) => {
    // @ts-ignore
    chrome.storage.local.get(["scrapper-extension-is-active"], (resp: any) => {
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

export const setIsActive = (value: boolean): Promise<null> => {
  return new Promise<null>((res) => {
    // @ts-ignore
    chrome.storage.local.set({ "scrapper-extension-is-active": value }, () =>
      res(null)
    );
  });
};
