import { $ } from "../extension-src/utils";
import { toJpeg } from "html-to-image";
import download from "downloadjs";

const onClick = async () => {
  const rootEl = $("root");

  const urlParams = new URLSearchParams(window.location.search);
  const caseNumber = urlParams.get("caseNumber");
  const county = urlParams.get("county");

  if (county === "harris") {
    const top = await toJpeg(rootEl, {
      backgroundColor: "#ffffff",
      height: 1000,
    });

    download(top, `${caseNumber}.jpg`, "image/jpg");

    // @ts-ignore
    const bottomEl = document
      .getElementsByTagName("odyssey-html")[0]
      .shadowRoot.getElementById("eventsInformationDiv");
    if (!bottomEl) {
      return;
    }
    const bottom = await toJpeg(bottomEl, { backgroundColor: "#ffffff" });

    download(bottom, `${caseNumber}-events.jpg`, "image/jpg");
    return;
  }

  const res = await toJpeg(rootEl, { backgroundColor: "#ffffff" });
  download(res, `${caseNumber}.jpg`, "image/jpg");
};

const imageDownloadMain = () => {
  const btnEl = $<HTMLButtonElement>("image-download");
  btnEl.classList.remove("bg-orange-500");
  btnEl.classList.add("bg-indigo-500");

  let isProcessing = false;
  btnEl.onclick = () => {
    if (isProcessing) {
      return;
    }
    isProcessing = true;
    onClick().finally(() => {
      isProcessing = false;
    });
  };
};

export default imageDownloadMain;
