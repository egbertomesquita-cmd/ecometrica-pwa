const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

[
  'params.get("screening")',
  'id="prisma-screening"',
  'go(`prisma?screening=${encodeURIComponent(event.target.value)}`)',
  'screenings.find(item=>item.id===requested)||screenings.at(-1)',
  '$("#prisma-screening")?.selectedOptions?.[0]?.textContent',
].forEach(fragment => assert.ok(source.includes(fragment), `Trecho obrigatório ausente: ${fragment}`));

const screenings = [{ id: "triagem-a" }, { id: "triagem-b" }];
const select = requested => screenings.find(item => item.id === requested) || screenings.at(-1);
assert.equal(select("triagem-a").id, "triagem-a");
assert.equal(select("triagem-b").id, "triagem-b");
assert.equal(select("inexistente").id, "triagem-b");

console.log("OK: seleção da triagem de origem e persistência na rota validadas.");
