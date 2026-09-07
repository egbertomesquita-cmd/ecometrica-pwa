import fs from "node:fs";
import assert from "node:assert/strict";

const source=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");

assert.match(source,/const project=screeningProtocolProject\(selected\),exclusionCriteria=criterionItems\(project\?\.exclusion_criteria\)/,"A Elegibilidade deve obter os critérios do protocolo vinculado à triagem.");
assert.match(source,/id="eligibility-exclusion-modal"/,"A exclusão deve abrir um formulário estruturado.");
assert.match(source,/Outro motivo excepcional/,"A tela deve permitir justificar uma exclusão não prevista.");
assert.match(source,/e\.exclusionCriterion=data\.exclusionCriterion\|\|""/,"O critério selecionado deve ser persistido separadamente.");
assert.match(source,/name="evidence" required/,"Toda exclusão deve exigir evidência encontrada no texto completo.");
assert.match(source,/e\.evidenceLocation=data\.evidenceLocation\|\|""/,"A localização da evidência deve ser auditável.");
assert.match(source,/if\(decision==="exclude"\)return openEligibilityExclusion\(selectedId\)/,"O formulário só deve aparecer ao solicitar a exclusão.");
assert.match(source,/EcoMétrica 3\.0 · Versão 93/,"A versão visível deve ser 93.");

console.log("OK: critérios do protocolo disponíveis e auditáveis na Elegibilidade.");
