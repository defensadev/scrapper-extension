(()=>{chrome.runtime.onMessage.addListener((t,i,n)=>{if(t==="selectionText"){let e=window.getSelection(),o=e?e.toString():"";n(o)}});})();
