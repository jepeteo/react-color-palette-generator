import{r as n,j as e}from"./index-ZMMdRs35.js";function u({onImageUpload:s}){const[t,i]=n.useState(null),a=n.useRef(null),c=d=>{const r=d.target.files[0];if(r&&r.type.substr(0,5)==="image"){const l=new FileReader;l.onloadend=()=>{i(l.result),s(l.result)},l.readAsDataURL(r)}},o=()=>{i(null),s(null),a.current&&(a.current.value="")};return e.jsxs("div",{className:"imageUpload",children:[e.jsx("h3",{className:"mb-2 w-full",children:"Upload Image to find primary color"}),e.jsxs("div",{className:"block",children:[e.jsx("label",{htmlFor:"imageToPrimary",className:"block w-fit w-full cursor-pointer rounded-lg border border-blue-400 px-2 py-1 hover:bg-slate-200",children:"Upload"}),e.jsx("input",{id:"imageToPrimary",ref:a,type:"file",accept:"image/*",onChange:c,className:"mb-2 hidden text-sm"}),t&&e.jsxs("div",{className:"flex",children:[e.jsx("img",{src:t,alt:"Uploaded preview",className:"mt-2 inline-block aspect-square max-w-24 object-cover"}),e.jsx("button",{onClick:o,className:"relative right-4 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white",children:e.jsx("span",{className:"text-1xl -mt-1",children:"x"})})]})]})]})}export{u as default};
