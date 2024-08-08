import{a as x,j as n,M as g}from"./index-j2UoESXb.js";function l(t,e){const c=x.contrast(t,e),r=c>=3,s=c>=4.5,a=c>=4.5,d=c>=7;return{contrast:c,aaLarge:r,aa:s,aaaLarge:a,aaa:d}}const b=(t,e)=>{const c=[{text:t.paragraphText,background:e.background},{text:t.headerText,background:t.headerBackground},{text:t.navText,background:t.navBackground},{text:t.heading1,background:t.background},{text:t.heading2,background:t.background},{text:t.linkText,background:t.background},{text:t.blockquoteText,background:t.background},{text:t.listText,background:t.background},{text:t.buttonText,background:t.buttonBackground},{text:t.footerText,background:t.footerBackground}],r=c.length*2;let s=0;return c.forEach(({text:a,background:d})=>{const{aa:u,aaa:i}=l(a,d);u&&s++,i&&s++}),s/r*100},p=({elements:t,colors:e,palette:c,onElementClick:r})=>{const s=b(e,c);return n.jsxs("div",{className:"colorListElements",children:[n.jsx("div",{className:"containerTitle mb-4",children:"Detailed Color List"}),n.jsxs("div",{className:"mb-4 rounded bg-gray-100 p-2",children:[n.jsxs("p",{className:"font-bold",children:["Accessibility Score: ",s.toFixed(2),"%"]}),n.jsxs("p",{className:"text-sm",children:[s>=90?"Excellent":s>=70?"Good":s>=50?"Fair":"Poor"," ","accessibility"]})]}),n.jsx("ul",{className:"space-y-1.5",children:Object.entries(t).map(([a,d])=>{const u=e[a];let i;a==="background"?i=e.paragraphText:a==="buttonText"?i=e.buttonBackground:a==="inputBackground"?i=e.inputText:a==="navText"?i=e.navBackground:i=c.background;const o=l(u,i);return n.jsxs("li",{className:"grid grid-cols-12 items-center",children:[n.jsx("span",{className:"col-span-7 text-sm",children:d}),n.jsx("span",{className:"col-span-3 ml-auto text-right text-sm uppercase",children:e[a]||"Not set"}),n.jsx("div",{className:"col-span-1 ml-auto h-5 w-5 cursor-pointer rounded-full border",style:{backgroundColor:e[a]||"#ccc"},onClick:()=>r(a)}),n.jsx("div",{className:"col-span-1 ml-2 cursor-help text-sm","data-tooltip-id":`tooltip-${a}`,"data-tooltip-content":`Contrast: ${o.contrast.toFixed(2)} | AA: ${o.aa?"✅":"❌"} | AAA: ${o.aaa?"✅":"❌"}`,children:o.aa?"✅":"❌"}),n.jsx(g,{id:`tooltip-${a}`})]},a)})})]})};export{p as default};
