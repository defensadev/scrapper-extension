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
    const els = this.shadow.querySelectorAll(".loadingmessagediv");
    console.log(els);
    for (let i = 0; i < els.length; i++) {
      els[i].remove();
    }
  }
}

export default Odyssey;
