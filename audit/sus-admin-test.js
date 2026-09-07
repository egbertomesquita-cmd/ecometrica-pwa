const fs=require("fs"),assert=require("assert");
const app=fs.readFileSync("app.js","utf8"),migration=fs.readFileSync("supabase/migrations/202609070002_consolidate_scientific_record_select.sql","utf8");

assert.match(app,/function susAdminPanel\(/,"O painel SUS administrativo deve existir.");
assert.match(app,/function exportSusDetailed\(/,"A exportação detalhada deve existir.");
assert.match(app,/function exportSusSummary\(/,"A exportação estatística deve existir.");
assert.match(app,/function exportSusJson\(/,"A exportação técnica JSON deve existir.");
assert.match(app,/sampleDeviation/,"O resumo deve calcular o desvio-padrão amostral.");
assert.match(app,/positive_response - 1, 5 - negative_response/,"O JSON deve documentar a fórmula SUS.");
assert.match(migration,/record_type = 'product_validation'/,"A política administrativa deve limitar a leitura às avaliações do produto.");
assert.match(migration,/profiles\.role = 'admin'/,"A política deve exigir perfil administrativo.");
assert.doesNotMatch(migration,/for (update|delete|all)/i,"A política administrativa não pode conceder escrita em respostas alheias.");
console.log("Auditoria SUS administrativa: OK");
