import fs from "node:fs";
import assert from "node:assert/strict";

const app=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../analytics.css",import.meta.url),"utf8");

assert.match(app,/const CHART_PALETTE=\["#0072B2","#D55E00","#009E73","#6F4E9C","#CC3311","#E69F00"/,"As redes devem usar uma paleta categórica de alto contraste.");
assert.match(app,/const TEMPORAL_PALETTE=\["#313695","#4575B4","#74ADD1","#FEE090","#F46D43","#A50026"\]/,"A evolução temporal deve usar uma escala divergente explícita.");
assert.match(app,/color=CHART_PALETTE\[i%CHART_PALETTE\.length\]/,"Os nós devem consumir a paleta compartilhada.");
assert.match(css,/\.network-nodes circle\{[^}]*opacity:1/,"Os nós não devem perder contraste por transparência.");
assert.match(css,/repeating-linear-gradient\(135deg,#D55E00/,"A série esperada deve usar cor e textura, sem depender apenas da cor.");
assert.match(css,/linear-gradient\(90deg,#313695 0%,#4575B4 20%,#74ADD1 40%,#FEE090 60%,#F46D43 80%,#A50026 100%\)/,"A legenda temporal deve corresponder à escala dos nós.");
assert.match(app,/EcoMétrica 3\.0 · Versão 91/,"A versão pública deve ser 91.");

console.log("OK: contraste e redundância visual das escalas de gráficos validados.");
