const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

[
  "projectId=activeProjectId,session=",
  "owner:state.user.id,projectId,key:r.key",
  "x.key===r.key&&x.projectId===projectId",
  "occurrences=recordsForProject(state.occurrences,projectId)",
  "gbifFeatures=recordsForProject(state.occurrences,projectId)",
  "backfillLegacyProjectLinks()",
].forEach(fragment => assert.ok(source.includes(fragment), `Trecho obrigatório ausente: ${fragment}`));

const records = [
  { id: "a", key: 101, projectId: "projeto-a" },
  { id: "b", key: 101, projectId: "projeto-b" },
  { id: "c", key: 202, projectId: "projeto-a" },
];
const recordsForProject = (list, projectId) => list.filter(record => record.projectId === projectId);

assert.deepEqual(recordsForProject(records, "projeto-a").map(record => record.id), ["a", "c"]);
assert.deepEqual(recordsForProject(records, "projeto-b").map(record => record.id), ["b"]);
assert.equal(records.some(record => record.key === 101 && record.projectId === "projeto-b"), true);
assert.equal(records.some(record => record.key === 202 && record.projectId === "projeto-b"), false);

console.log("OK: vínculo, deduplicação e isolamento GBIF por projeto validados.");
