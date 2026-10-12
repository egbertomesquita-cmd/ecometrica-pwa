import fs from "node:fs";
import assert from "node:assert/strict";

const app=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");

assert.match(app,/scale:300\/96/,"A rasterização deve usar escala equivalente a 300 DPI.");
assert.match(app,/data-chart-format="png"/,"Cada gráfico deve oferecer PNG.");
assert.match(app,/data-chart-format="jpeg"/,"Cada gráfico deve oferecer JPEG.");
assert.match(app,/data-chart-format="pdf"/,"Cada gráfico deve oferecer PDF.");
assert.match(app,/widthMm=canvas\.width\/300\*25\.4,heightMm=canvas\.height\/300\*25\.4/,"O PDF deve preservar as dimensões calculadas em 300 DPI.");
assert.match(app,/wrapper\.querySelectorAll\("\.network-focus-label,\.network-legend,\.chart-export-tools,\.muted"\)/,"A exportação deve remover orientações e notas não essenciais.");
assert.match(app,/wrapper\?\.remove\(\);if\(canvas\)\{canvas\.width=0;canvas\.height=0\}/,"A memória e o conteúdo temporário devem ser liberados após cada arquivo.");
assert.match(app,/setupChartExports\(\);/,"Os controles devem ser ativados após a renderização.");
assert.match(app,/EcoMétrica 3\.0 · Versão 95/,"A versão pública deve ser 95.");

console.log("OK: exportação individual em PNG, JPEG e PDF a 300 DPI validada.");
