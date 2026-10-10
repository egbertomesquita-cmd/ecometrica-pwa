const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'Três bases',disabled:false});return nodes.get(id)};
const context=vm.createContext({console,Date,structuredClone,crypto:require('node:crypto').webcrypto,history:{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{querySelector:node},location:{hash:''},setTimeout:()=>0,clearTimeout:()=>{}});
// Load the actual production functions without bootstrapping authentication.
vm.runInContext(source.slice(0,source.indexOf('window.addEventListener("hashchange"')),context);
const run=code=>vm.runInContext(code,context);
(async()=>{
 context.files=[{name:'one.ris',text:async()=> 'TY  - JOUR\nTI  - Shared study\nPY  - 2020\nDO  - 10.1000/shared\nER  -\n'}, {name:'two.csv',text:async()=> 'title,year,doi\nShared study,2020,10.1000/shared'}, {name:'three.bib',text:async()=> '@article{third,\ntitle={Shared study},\nyear={2020},\ndoi={10.1000/shared}\n}\n'}];
 await run('handleFiles(files)');
 assert.equal(run('pendingImport.length'),3);assert.equal(node('#save-import').disabled,true);
 run('updateImportDatabase(0,"Scopus");updateImportDatabase(1,"Web of Science");updateImportDatabase(2,"SciELO")');
 assert.equal(node('#save-import').disabled,false);
 assert.equal(run('detectDuplicates(pendingImport).length'),2);
 assert.ok(node('#import-metrics').innerHTML.includes('Pares entre bases diferentes'));
 run('state.user={id:"researcher",name:"Pesquisador"};activeProjectId="project";saveImport()');
 assert.equal(run('state.sessions.length'),1);assert.equal(run('state.deduplicationAudits.length'),2);
 assert.deepEqual(Array.from(run('state.articles.map(a=>a.sourceDatabase)')),['Scopus','Web of Science','SciELO']);
 assert.deepEqual(Array.from(run('state.articles.map(a=>a._file)')),['one.ris','two.csv','three.bib']);
 assert.ok(run('auditPair(state.deduplicationAudits[0])').includes('Web of Science'));
 assert.ok(run('articleTable(state.articles)').includes('three.bib'));
 assert.ok(run('prismaSources(state.sessions[0].id)').includes('SciELO (n = 1)'));
 let exported;context.capture=(...args)=>exported=args;run('download=capture;exportDedupAudit(state.sessions[0].id)');
 assert.ok(exported[1].includes('base_principal'));assert.ok(exported[1].includes('two.csv'));
 // A recognized origin inside CSV is retained, but a file format is never guessed as a database.
 context.files=[{name:'embedded.csv',text:async()=> 'title,source\nExample,PubMed'}];await run('handleFiles(files)');assert.equal(run('pendingFiles[0].database'),'PubMed');
 context.files=[{name:'unidentified.csv',text:async()=> 'title\nExample'}];await run('handleFiles(files)');assert.equal(node('#save-import').disabled,true);
 run('updateImportDatabase(0,"<Custom & base>")');assert.ok(node('#import-records').innerHTML.includes('&lt;Custom &amp; base&gt;'));
 console.log('OK: três formatos/bases, duplicatas, persistência, PRISMA, auditoria, exportação e escape HTML.');
})().catch(error=>{console.error(error);process.exitCode=1});
