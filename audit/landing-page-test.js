import fs from "node:fs";
import assert from "node:assert/strict";

const source=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");

assert.match(source,/01","Seleção","Triagem sistemática"/,"A página deve separar categoria e título da triagem.");
assert.match(source,/02","Rastreabilidade","Fluxo PRISMA 2020"/,"O cartão do PRISMA deve comunicar sua finalidade.");
assert.match(source,/03","Resultados","Análise cienciométrica"/,"O cartão de análises deve possuir categoria própria.");
assert.match(source,/04","Biodiversidade","Distribuição espacial"/,"O cartão espacial deve distinguir estudos e GBIF.");
assert.doesNotMatch(source,/<span class="eyebrow">\$\{x\[0\]\}<\/span><b>\$\{x\[0\]\}/,"A página não deve repetir o mesmo título no cartão.");
assert.match(source,/EcoMétrica 3\.0 · Versão 95/,"A versão pública deve ser 95.");

console.log("OK: página inicial sem títulos repetidos e com hierarquia funcional.");
