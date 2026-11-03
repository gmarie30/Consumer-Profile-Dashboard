import { describe, expect, it } from 'vitest';
import { buildGraph, inferCategory, RecordItem, summarize } from './model';

// Development fixtures test inference only; they are never loaded by the app.
const fixture: RecordItem[] = [
  { id:'f1', source:'fixture', title:'Camera review', domain:'example.test', category:'Technology', kind:'visit', date:new Date('2025-01-01T11:00:00Z') },
  { id:'f2', source:'fixture', title:'Camera comparison', domain:'example.test', category:'Technology', kind:'visit', date:new Date('2025-01-02T13:00:00Z') },
  { id:'f3', source:'fixture', title:'Faith center', domain:'private.test', category:'Excluded', kind:'visit' },
];

describe('local inference safeguards', () => {
  it('maps ordinary topic text to a broad category', () => {
    expect(inferCategory('mirrorless camera review')).toBe('Technology');
  });
  it('excludes text matching a sensitive topic rule', () => {
    expect(inferCategory('religion community center')).toBe('Excluded');
  });
  it('counts records and domains from supplied records only', () => {
    const result=summarize(fixture);
    expect(result.categories.Technology).toBe(2);
    expect(result.domains['example.test']).toBe(2);
  });
  it('connects entities only through shared observed categories', () => {
    const graph=buildGraph(fixture);
    expect(graph.nodes.some(n=>n.id==='example.test')).toBe(true);
    expect(graph.nodes.some(n=>n.id==='private.test')).toBe(false);
    expect(graph.links.every(l=>l.weight>0)).toBe(true);
  });
});
