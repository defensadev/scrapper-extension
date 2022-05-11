(()=>{var r=e=>{let t=document.getElementById(e);if(!t)throw new Error(`expected element with id: "${e}"`);return t};var i=class extends HTMLElement{constructor(){super();this.odysseyHTML="",this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=this.odysseyHTML;let n=this.shadow.querySelectorAll(".loadingmessagediv");for(let o=0;o<n.length;o++)n[o].remove()}},d=i;var y={harris:/^[0-9]+$/,tarrant:/^JP[0-9]+-[0-9]+-E.+$/,fortbend:/^[0-9]+-JEV[0-9]+-[0-9]+$/},b=e=>{let t=r("county");if(t.value)return t.value.toLowerCase();for(let n in y)if(y[n].test(e))return n;throw new Error(`Could not recognize county for case number ${e}`)},a={caseNumber:"",county:""},u=async()=>{let e=r("case-number").value;if(!e)return;let t=r("root");try{let n=b(e);if(n===a.county&&e===a.caseNumber)return;a.caseNumber=e,a.county=n,history.pushState({},"",`?caseNumber=${e}&county=${n}`);let o=document.createElement("div");o.className="m-4 font-extrabold text-gray-700",o.innerText="Loading...",t.innerHTML="",t.appendChild(o);let s=`https://ihaucbf8v2.execute-api.us-east-1.amazonaws.com/${n}?caseNumber=${e}`,h=(await fetch(s).then(async m=>{let p=await m.text();if(m.status!==200)throw new Error(p);return p})).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""),l=document.createElement("odyssey-html");l.odysseyHTML=h,t.innerHTML="",t.appendChild(l)}catch(n){let o=document.createElement("p");o.className="text-red-500",o.innerText=n.message,t.innerHTML="",t.appendChild(o)}},w=()=>{customElements.define("odyssey-html",d);let e=r("case-number");e.onblur=()=>u(),e.onkeydown=c=>{c.key==="Enter"&&e.blur()};let t=r("county");t.onblur=()=>u(),t.onkeydown=c=>{c.key==="Enter"&&e.value.length>0&&t.blur()};let n=new URLSearchParams(window.location.search),[o,s]=[n.get("caseNumber"),n.get("county")];s&&(t.value=s),o&&(e.value=o,u())};w();})();
