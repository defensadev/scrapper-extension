class Odyssey extends HTMLElement {
  shadow: ShadowRoot;
  odysseyHTML: string;

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
    const els = document.getElementsByClassName("loadingmessagediv");
    for (let i = 0; i < els.length; i++) {
      els[i].remove();
    }
  }
}

export default Odyssey;
