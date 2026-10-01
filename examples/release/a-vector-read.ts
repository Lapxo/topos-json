// A vector file asked of this world through its own index: what the document says of itself, then every name it cites.
import { observe } from '../../src/index.ts';

const vector = {
  title: 'Doors',
  about: ['A door opens only from shut, and a locked door opens only once it is unlocked.'],
  cases: [
    { name: 'a-shut-door-opens', epochs: [{ state: 'SHUT' }, { state: 'OPEN' }] },
    { name: 'a-locked-door-waits', expect: { 'LOCKED→SHUT': true }, epochs: [{ state: 'LOCKED' }, { state: 'SHUT' }, { state: 'OPEN' }] },
  ],
  law: { dangerous: [['LOCKED', 'OPEN']], why_the_others_are_not: { 'SHUT→OPEN': 'a shut door is free to open' } },
};
const bytes = new TextEncoder().encode(JSON.stringify(vector));

for (const region of ['json-said', 'json-cites']) {
  for (const row of observe(bytes, 'acme/vectors/doors.json', region) as { scope: string; bound: { values: readonly string[] } }[]) console.log(`${region.padEnd(10)} ${row.scope} · ${row.bound.values.join(' | ')}`);
}
