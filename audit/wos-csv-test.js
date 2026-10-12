const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const context=vm.createContext({});
vm.runInContext(app.slice(app.indexOf('function norm('),app.indexOf('function parseRIS(')),context);
const parse=text=>{context.csv=text;return vm.runInContext('parseCSV(csv)',context)};
const rows=parse('\uFEFFAuthors;Article Title;Publication Year;DOI;Source Title;Author Keywords;Keywords Plus;Abstract\r\n"Silva; Lima";"Study; with quotes ""and commas,""";2025;10.1000/test;Journal;fish;water;"First line\r\nsecond line"\r\n');
assert.equal(rows.length,1);assert.equal(rows[0].title,'Study; with quotes "and commas,"');assert.equal(rows[0].year,2025);assert.equal(rows[0].journal,'Journal');assert.equal(rows[0].source,'Web of Science');assert.equal(rows[0].keywords,'fish; water');assert.equal(rows[0].abstract,'First line\r\nsecond line');
assert.equal(parse('title,authors,year\n"A, B",Silva,2020')[0].title,'A, B');
assert.equal(parse('TI\tAU\tPY\nStudy\tSilva\t2021')[0].year,2021);
assert.equal(parse('title,year\n\nStudy,2022\n')[0].title,'Study');
assert.throws(()=>parse('title,abstract\nStudy,"not closed'),/não foi fechado/);
// Optional local fixture is never bundled or uploaded.
if(process.argv[2]){
 const actual=parse(fs.readFileSync(process.argv[2],'utf8'));
 assert.equal(actual.length,49);assert.equal(actual.filter(a=>a.title).length,49);assert.equal(actual.filter(a=>a.year).length,49);assert.equal(actual.filter(a=>a.journal).length,49);
 assert.equal(actual[0].title,'Morphology of the Tympano-Periotic Complex in Stranded Odontocetes in Northeast Brazil');assert.equal(actual[0].doi,'10.1002/jmor.70089');
 console.log('Arquivo real: 49/49 títulos, anos e periódicos recuperados.');
}
console.log('OK: cabeçalhos WoS, BOM, delimitadores, aspas escapadas e resumos multilinha.');
