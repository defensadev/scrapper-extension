(()=>{var r=t=>{let e=document.getElementById(t);if(!e)throw new Error(`expected element with id: "${t}"`);return e};var a=class extends HTMLElement{constructor(){super();this.odysseyHTML="",this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=this.odysseyHTML;let s=document.getElementsByClassName("loadingmessagediv");for(let n=0;n<s.length;n++)s[n].remove()}},c=a;var d=()=>new URLSearchParams(window.location.search),i=async()=>{let t=r("case-number").value;if(!t)return;let e=r("root");e.innerHTML="";let s=document.createElement("div");s.className="m-4 font-extrabold text-gray-700",s.innerText="Loading...",e.appendChild(s);let n=`https://ihaucbf8v2.execute-api.us-east-1.amazonaws.com/harris?caseNumber=${t}`,l=(await fetch(n).then(m=>m.text())).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""),o=document.createElement("odyssey-html");o.odysseyHTML=l,o.render(),e.innerHTML="",e.appendChild(o)},p=()=>{let t=r("case-number");t.onkeydown=s=>{s.key==="Enter"&&i()};let e=d().get("caseNumber");!e||(t.value=e,customElements.define("odyssey-html",c),i())};p();})();
