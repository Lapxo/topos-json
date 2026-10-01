import { documentOf, said } from '../helpers/rows.ts';
import type { Row } from '../helpers/rows.ts';

const NAME = /^[A-Za-z_$][\w$]*(?:-[A-Za-z0-9]+)*$/;

/** Every name a value holds at any depth: each key, and every string that is a name on its own. */
const namesOf = (x: unknown): readonly string[] => (Array.isArray(x) ? x.flatMap((one) => namesOf(one))
  : x !== null && typeof x === 'object' ? Object.entries(x).flatMap(([key, value]) => [...(NAME.test(key) ? [key] : []), ...namesOf(value)])
    : typeof x === 'string' && NAME.test(x) ? [x] : []);

/**
 * The json-cites region. It answers which names a JSON document cites: every key, and every value that is a name on its
 * own. Prose is not a citation, since a sentence has spaces, so a document's words never count, only what it names. Each
 * name is a point, `cite/<name>`, and every document that cites it is one more origin there.
 */
export const jsonCites = (bytes: Uint8Array): readonly Row[] => [...new Set(namesOf(documentOf(bytes)))].sort().map((name) => said(`cite/${name}`, 'cites', [name]));

export { jsonCites as observe };
