export interface State {
  caseNumber?: string;
  county?: string;
}

export interface Counties {
  [key: string]: RegExp;
}

export const counties: Counties = {
  harris: /^[0-9]+$/,
  tarrant: /^JP[0-9]+-[0-9]+-E.+$/,
  fortbend: /^[0-9]+-JEV[0-9]+-[0-9]+$/,
};

export const state: State = {};

export const prevState: State = {};

export const onReadyState = async (): Promise<null> => {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    return null;
  }
  return new Promise<null>((res) =>
    document.addEventListener("readystatechange", function l() {
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        document.removeEventListener("readystatechange", l);
        res(null);
      }
    })
  );
};
