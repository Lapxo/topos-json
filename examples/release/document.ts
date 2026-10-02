// One document, asked of this world through the one contract: what it says of itself, then the names it cites.
import { readFileSync } from 'node:fs';
import { declarationOf, shell } from '@lapxo/topos/capsule';
import { answer } from '@lapxo/topos/contract';
import { PROTOCOL, canonical } from '@lapxo/topos/wire';
import { render as said } from '../../src/regions/json-said.ts';
import { render as cites } from '../../src/regions/json-cites.ts';

const lock = readFileSync(new URL('../../capsule.bound', import.meta.url), 'utf8').split('\n').filter((line) => line.startsWith('bound-lock/1'));
const declared = declarationOf(lock);
const render = shell({
  'json-said': { reads: declared.regions['json-said'] ?? [], region: said },
  'json-cites': { reads: declared.regions['json-cites'] ?? [], region: cites },
});
const key = (lock.find((line) => line.includes(' scope=capsule/key ')) ?? '').split(' value=')[1]?.split(' ')[0] ?? '';
const prose = lock.filter((line) => line.includes(` scope=prose/en/${key}/`)).map((line) => line.replace(` scope=prose/en/${key}/`, ' scope=prose/en/'));
const words = [
  canonical({ at: 'policy:document/words', by: 'target', form: 'alphabet', measure: 'id', role: 'writes', scope: 'form/template/json/row', value: 'field|measure|value' }),
  canonical({ at: 'policy:document/words', by: 'target', form: 'alphabet', measure: 'id', role: 'writes', scope: 'form/template/json/cite', value: 'name' }),
  canonical({ at: 'policy:document/words', by: 'target', form: 'alphabet', measure: 'id', role: 'writes', scope: 'lang', value: 'en' }),
];
const document = [
  canonical({ at: 'policy:document/fields', by: 'target', form: 'alphabet', measure: 'text', role: 'writes', scope: 'json/title', value: 'the doors' }),
  canonical({ at: 'policy:document/fields', by: 'target', form: 'alphabet', measure: 'text', role: 'writes', scope: 'json/about', value: 'A door opens only from shut.' }),
  canonical({ at: 'policy:document/fields', by: 'target', form: 'alphabet', measure: 'id', role: 'writes', scope: 'json/fields', value: 'title|about|cases' }),
];
const ask = (region: string): string => ((got) => (got.kind === 'fact' ? got.lines.join('\n') : got.why))(
  answer({ render }, { protocol: PROTOCOL, verb: 'render', rootScope: '', files: [], lines: [...words, ...prose, ...document], region, at: 3, shape: 'README.md', name: 'document', reads: declared.regions[region] ?? [] }, '') as { kind: string; lines: string[]; why: string });

for (const line of lock.filter((one) => one.includes(' scope=capsule/') || one.includes(' scope=region/'))) console.log(line);
console.log(ask('json-said'));
console.log(ask('json-cites'));
