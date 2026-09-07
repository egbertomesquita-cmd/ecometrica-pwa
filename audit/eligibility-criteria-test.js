import fs from "node:fs";
import assert from "node:assert/strict";

const source=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");

assert.match(source,/const project=screeningProtocolProject\(selected\),exclusionCriteria=criterionItems\(project\?\.exclusion_criteria\)/,"A Elegibilidade deve obter os critérios do protocolo vinculado à triagem.");
assert.match(source,/id="elig-exclusion-criterion"/,"A tela deve apresentar o seletor de critérios de exclusão.");
assert.match(source,/Outro motivo não previsto no protocolo/,"A tela deve permitir justificar uma exclusão não prevista.");
assert.match(source,/e\.exclusionCriterion=decision==="exclude"&&!custom\?criterion:""/,"O critério selecionado deve ser persistido separadamente.");
assert.match(source,/if\(decision==="exclude"&&!criterion\)return toast\("Selecione um critério de exclusão do protocolo\."\)/,"Uma exclusão não pode ser registrada sem critério.");
assert.match(source,/if\(decision==="exclude"&&custom&&!note\)return toast\("Descreva o outro motivo de exclusão\."\)/,"Outro motivo deve exigir justificativa.");
assert.match(source,/EcoMétrica 3\.0 · Versão 88/,"A versão visível deve ser 88.");

console.log("OK: critérios do protocolo disponíveis e auditáveis na Elegibilidade.");
