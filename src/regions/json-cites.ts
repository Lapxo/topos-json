import { found, lang, listed, of } from '@lapxo/topos/capsule';
import type { Asked } from '@lapxo/topos/capsule';
import { alphabet, steps } from '@lapxo/topos/wire';
import { documentOf, said } from '../helpers/rows.ts';
import type { Family, Row } from '../helpers/rows.ts';

const letter = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
const digit = (c: string): boolean => c >= '0' && c <= '9';
const mark = (c: string): boolean => '_$'.includes(c);
const dashed = (c: string): boolean => '-'.includes(c);
const lead = (c: string): boolean => letter(c) || mark(c);
const word = (c: string): boolean => lead(c) || digit(c);
const tail = (c: string): boolean => letter(c) || digit(c);
const named = (text: string): boolean => {
  const chars = [...text];
  let i = 0;
  const take = (ok: (c: string) => boolean): boolean => { const c = chars[i]; if (c === undefined || !ok(c)) return false; i += 1; return true; };
  if (!take(lead)) return false;
  while (chars[i] !== undefined && word(chars[i] ?? '')) i += 1;
  while (chars[i] !== undefined && dashed(chars[i] ?? '')) { i += 1; if (!take(tail)) return false; while (chars[i] !== undefined && tail(chars[i] ?? '')) i += 1; }
  return i === chars.length;
};

const namesOf = (x: unknown): readonly string[] => (Array.isArray(x) ? x.flatMap((one) => namesOf(one)) : x !== null && typeof x === 'object' ? Object.entries(x).flatMap(([key, value]) => [...(named(key) ? [key] : []), ...namesOf(value)]) : typeof x === 'string' && named(x) ? [x] : []);

/** The json-cites region. It answers which names a JSON document cites. */
export const jsonCites = (bytes: Uint8Array): readonly Row[] => [...new Set(namesOf(documentOf(bytes)))].sort().map((name) => said(`cite/${name}`, 'cites', [name]));

export const observe = jsonCites;

const words = (asked: Asked, key: string): string => of(found(asked, `prose/${lang(asked)}/${key}`), 'about');
const fill = (asked: Asked, name: string): string => listed(asked, 'form/template/json/cite').reduce((text, field) => text.split(`{${field}}`).join(name), words(asked, 'cite'));

/** The names a document cites: each name its lines hold, in order. */
export const render = (asked: Asked): readonly string[] => {
  const names = [...new Set(asked.lines.flatMap((line) => (([family, field, ...more]) => (family === ('json' satisfies Family) && field !== undefined && !more.length ? alphabet(of(line, 'value')).members.filter(named) : []))(steps(of(line, 'scope')))))].sort();
  return names.length ? [words(asked, 'cites'), '', ...names.map((name) => fill(asked, name))] : [];
};
