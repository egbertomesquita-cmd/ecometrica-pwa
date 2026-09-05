#!/usr/bin/env node
const fs = require("fs");
const input = process.argv[2];
if (!input) throw new Error("Uso: node audit/graph-audit.js <backup.json>");
const state = JSON.parse(fs.readFileSync(input, "utf8"));
const splitTerms = (value, kind) => [...new Set(String(value || "").split(kind === "authors" ? /;|\sand\s/i : /[;,|]/).map(x => x.trim()).filter(Boolean).map(x => kind === "keywords" ? x.toLowerCase() : x))];
const hIndex = values => values.map(v => Math.max(0, Number(v) || 0)).sort((a, b) => b - a).reduce((h, v, i) => v >= i + 1 ? i + 1 : h, 0);
const dupCount = (rows, key) => rows.length - new Set(rows.map(row => String(row[key]))).size;
const byId = rows => new Set(rows.map(row => String(row.id)));
const articleIds = byId(state.articles);
const sessionIds = byId(state.sessions);
const screeningIds = byId(state.screeningSessions);
const orphan = (rows, field, ids) => rows.filter(row => !ids.has(String(row[field]))).length;

function scopeArticles(sessionId, scope) {
  const dedup = state.articles.filter(a => a.sessionId === sessionId && !a.isDuplicate);
  const screenings = state.screeningSessions.filter(s => s.analysisSessionId === sessionId);
  const screening = screenings.at(-1);
  if (scope === "deduplicated") return dedup;
  if (!screening) return [];
  const decisions = scope === "screened" ? state.screeningDecisions : state.eligibilityDecisions;
  const accepted = new Set(decisions.filter(d => d.screeningSessionId === screening.id && d.decision === "include").map(d => d.articleId));
  return dedup.filter(a => accepted.has(a.id));
}

function metrics(arts) {
  const years = new Map(), journals = new Map(), authors = new Map(), keywords = new Map();
  const add = (map, key) => { if (key) map.set(key, (map.get(key) || 0) + 1); };
  let journalFallbacks = 0;
  arts.forEach(a => {
    add(years, a.year);
    if (!String(a.journal || "").trim() && String(a.source || "").trim()) journalFallbacks++;
    add(journals, a.journal || a.source);
    splitTerms(a.authors, "authors").forEach(x => add(authors, x));
    splitTerms(a.keywords, "keywords").forEach(x => add(keywords, x));
  });
  const citationValues = arts.map(a => Math.max(0, Number(a.citationCount) || 0));
  const authorCounts = [...authors.values()];
  const lotkaClasses = new Map();
  authorCounts.forEach(n => lotkaClasses.set(n, (lotkaClasses.get(n) || 0) + 1));
  const keywordCounts = [...keywords.values()];
  const pairs = kind => {
    const map = new Map();
    arts.forEach(a => {
      const terms = splitTerms(a[kind], kind);
      for (let i = 0; i < terms.length; i++) for (let j = i + 1; j < terms.length; j++) {
        const key = [terms[i], terms[j]].sort().join("\u0001");
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return map.size;
  };
  return {
    documents: arts.length,
    validYears: arts.filter(a => Number.isInteger(+a.year) && +a.year > 0).length,
    distinctYears: years.size,
    distinctJournalsOrSources: journals.size,
    journalFallbacks,
    distinctAuthors: authors.size,
    distinctKeywords: keywords.size,
    citations: citationValues.reduce((a, b) => a + b, 0),
    corpusHIndex: hIndex(citationValues),
    lotkaAuthors: authorCounts.length,
    lotkaSingletons: lotkaClasses.get(1) || 0,
    zipfOccurrences: keywordCounts.reduce((a, b) => a + b, 0),
    zipfHapax: keywordCounts.filter(n => n === 1).length,
    coauthorPairs: pairs("authors"),
    keywordPairs: pairs("keywords")
  };
}

const required = ["title", "authors", "journal", "year", "doi", "keywords", "abstract"];
const missing = Object.fromEntries(required.map(key => [key, state.articles.filter(a => key === "year" ? !(Number.isInteger(+a.year) && +a.year >= 1800 && +a.year <= new Date().getFullYear() + 1) : !String(a[key] || "").trim()).length]));
const sessionSummary = state.sessions.map(session => {
  const actual = state.articles.filter(a => a.sessionId === session.id).length;
  return {
    id: session.id,
    name: session.name,
    declaredArticles: session.articleCount,
    actualArticles: actual,
    countMatches: Number(session.articleCount) === actual,
    deduplicated: metrics(scopeArticles(session.id, "deduplicated")),
    screened: metrics(scopeArticles(session.id, "screened")),
    final: metrics(scopeArticles(session.id, "final"))
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  counts: Object.fromEntries(Object.entries(state).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, value.length])),
  integrity: {
    duplicateSessionIds: dupCount(state.sessions, "id"),
    duplicateArticleIds: dupCount(state.articles, "id"),
    duplicateScreeningDecisionIds: dupCount(state.screeningDecisions, "id"),
    duplicateEligibilityDecisionIds: dupCount(state.eligibilityDecisions, "id"),
    orphanArticlesBySession: orphan(state.articles, "sessionId", sessionIds),
    orphanScreeningsBySession: orphan(state.screeningSessions, "analysisSessionId", sessionIds),
    orphanScreeningDecisionsByArticle: orphan(state.screeningDecisions, "articleId", articleIds),
    orphanScreeningDecisionsByScreening: orphan(state.screeningDecisions, "screeningSessionId", screeningIds),
    orphanEligibilityDecisionsByArticle: orphan(state.eligibilityDecisions, "articleId", articleIds),
    orphanEligibilityDecisionsByScreening: orphan(state.eligibilityDecisions, "screeningSessionId", screeningIds),
    orphanExtractionsByArticle: orphan(state.articleExtractions, "articleId", articleIds)
  },
  missing,
  sessions: sessionSummary,
  spatial: {
    extractions: state.articleExtractions.length,
    occurrences: state.occurrences.length,
    occurrencesWithProjectId: state.occurrences.filter(x => x.projectId).length,
    distinctOccurrenceProjects: new Set(state.occurrences.map(x => x.projectId).filter(Boolean)).size
  }
};
process.stdout.write(JSON.stringify(report, null, 2));
