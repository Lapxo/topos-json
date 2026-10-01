import { documentOf, said } from '../helpers/rows.ts';
import type { Row } from '../helpers/rows.ts';

type Fields = Readonly<Record<string, unknown>>;

const text = (value: unknown): string | undefined =>
  (typeof value === 'string' ? value : Array.isArray(value) && value.every((one) => typeof one === 'string') ? value.join('\n') : undefined);
const record = (value: unknown): Fields => (value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Fields : {});
const MOVE = /^[A-Z]+→[A-Z]+$/;
const named = (one: Fields): readonly string[] => Object.keys(record(one['expect'])).filter((key) => MOVE.test(key));

/** The moves a document's cases name: every expected move between two states, and every step between the states its epochs live through. */
const movesOf = (cases: readonly Fields[]): readonly string[] => [...new Set(cases.flatMap((one) => ((lived) => [...named(one), ...lived.slice(1).map((state, i) => `${lived[i]}→${state}`)])(
  (Array.isArray(one['epochs']) ? one['epochs'] : []).map((epoch) => record(epoch)['state']).filter((state): state is string => typeof state === 'string'))))].sort();

/**
 * The json-said region. It answers what a JSON document says of itself, read from its own fields: the fields it has, the
 * paragraphs of its about, its title, its brief and the lines it carries; the moves its cases name; and the law it states
 * of those moves, the ones it calls dangerous and why each other one is not. A page quotes a sample or a vector by these
 * readings and never opens it.
 */
export const jsonSaid = (bytes: Uint8Array): readonly Row[] => {
  const doc = documentOf(bytes);
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) return [];
  const fields = doc as Fields;
  const cases = (Array.isArray(fields['cases']) ? fields['cases'] : []).map(record);
  const law = record(fields['law']);
  const dangerous = (Array.isArray(law['dangerous']) ? law['dangerous'] : []).filter((pair): pair is readonly string[] => Array.isArray(pair) && pair.every((one) => typeof one === 'string'));
  return [
    said('said/fields', 'id', Object.keys(fields).sort()),
    ...['about', 'title', 'brief', 'lines'].flatMap((name) => ((one) => (one === undefined ? [] : [said(`said/${name}`, 'text', [one])]))(text(fields[name]))),
    ...(cases.some((one) => named(one).length) ? [said('said/moves', 'id', movesOf(cases))] : []),
    ...(dangerous.length ? [said('said/law/dangerous', 'id', dangerous.map((pair) => pair.join('→')))] : []),
    ...Object.entries(record(law['why_the_others_are_not'])).flatMap(([move, why]) => (typeof why === 'string' ? [said(`said/law/why/${move}`, 'text', [why])] : [])),
  ];
};

export { jsonSaid as observe };
