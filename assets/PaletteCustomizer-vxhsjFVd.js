import{u as r,a as c,j as t,b as n,s as d}from"./index-3MPsG_3H.js";function h(){r(e=>e.color.primaryColor);const a=r(e=>e.color.palette),l=c(),o=(e,s)=>{l(n({colorName:e,newValue:s})),e==="primary"&&l(d(s))};return!a||typeof a!="object"?t.jsx("div",{children:"Loading palette..."}):t.jsxs("div",{className:"containerCustomizePalette",children:[t.jsx("h2",{className:"containerTitle",children:"Customize Palette"}),t.jsx("div",{className:"containerPalette",children:Object.entries(a).map(([e,s])=>t.jsxs("div",{className:"paletteItems",children:[t.jsxs("label",{htmlFor:`color-${e}`,className:"mr-2",children:[e,":"]}),t.jsx("input",{type:"color",id:`color-${e}`,value:s,onChange:i=>o(e,i.target.value),className:"h-8 w-8"})]},e))})]})}export{h as default};
