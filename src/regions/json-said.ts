import { found, lang, listed, of } from '@lapxo/topos/capsule';
import type { Asked } from '@lapxo/topos/capsule';
import { steps } from '@lapxo/topos/wire';
import { documentOf, said } from '../helpers/rows.ts';
import type { Family, Row } from '../helpers/rows.ts';

type Fields = Readonly<Record<string, unknown>>;
const textOf = (value: unknown): string | undefined => (typeof value === 'string' ? value : Array.isArray(value) && value.every((one) => typeof one === 'string') ? value.join('\n') : undefined);
const record = (value: unknown): Fields => (value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Fields : {});
const arrow = JSON.parse('"\\u2192"') as string;
const upper = (c: string): boolean => c >= 'A' && c <= 'Z';
const moved = (pair: string): boolean => ((at) => at > 0 && pair.slice(0, at).length > 0 && pair.slice(at + 1).length > 0 && [...pair.slice(0, at)].every(upper) && [...pair.slice(at + 1)].every(upper))(pair.indexOf(arrow));
const named = (one: Fields): readonly string[] => Object.keys(record(one['expect'])).filter(moved);

const movesOf = (cases: readonly Fields[]): readonly string[] => [...new Set(cases.flatMap((one) => ((lived) => [...named(one), ...lived.slice(1).map((state, i) => `${lived[i]}${arrow}${state}`)])((Array.isArray(one['epochs']) ? one['epochs'] : []).map((epoch) => record(epoch)['state']).filter((state): state is string => typeof state === 'string'))))].sort();

/** What a JSON document says of itself, read from its own fields. */
export const jsonSaid = (bytes: Uint8Array): readonly Row[] => {
  const doc = documentOf(bytes);
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) return [];
  const fields = doc as Fields;
  const cases = (Array.isArray(fields['cases']) ? fields['cases'] : []).map(record);
  const law = record(fields['law']);
  const dangerous = (Array.isArray(law['dangerous']) ? law['dangerous'] : []).filter((pair): pair is readonly string[] => Array.isArray(pair) && pair.every((one) => typeof one === 'string'));
  return [said('said/fields', 'id', Object.keys(fields).sort()), ...['about', 'title', 'brief', 'lines'].flatMap((name) => ((one) => (one === undefined ? [] : [said(`said/${name}`, 'text', [one])]))(textOf(fields[name]))), ...(cases.some((one) => named(one).length) ? [said('said/moves', 'id', movesOf(cases))] : []), ...(dangerous.length ? [said('said/law/dangerous', 'id', dangerous.map((pair) => pair.join(arrow)))] : []), ...Object.entries(record(law['why_the_others_are_not'])).flatMap(([move, why]) => (typeof why === 'string' ? [said(`said/law/why/${move}`, 'text', [why])] : []))];
};

export const observe = jsonSaid;

const words = (asked: Asked, key: string): string => of(found(asked, `prose/${lang(asked)}/${key}`), 'about');
const fill = (asked: Asked, fields: Readonly<Record<string, string>>): string => listed(asked, 'form/template/json/row').reduce((text, field) => text.split(`{${field}}`).join(fields[field] ?? ''), words(asked, 'row'));

/** The json-said region. It answers what a document says: each of its lines, the field it names and the value it holds. */
export const render = (asked: Asked): readonly string[] => {
  const rows = asked.lines.flatMap((line) => (([family, field, ...more]) => (family === ('json' satisfies Family) && field !== undefined && !more.length ? [{ field, measure: of(line, 'measure'), value: of(line, 'value') }] : []))(steps(of(line, 'scope'))));
  return rows.length ? [words(asked, 'said'), '', words(asked, 'table'), words(asked, 'rule'), ...rows.map((one) => fill(asked, one))] : [];
};
