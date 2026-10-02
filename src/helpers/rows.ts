/** A claim a region reads off a JSON document: a scope, the measure it is read under, and the words it holds. */
export type Row = { readonly scope: string; readonly measure: string; readonly role: 'reads'; readonly bound: { readonly kind: 'enumerated'; readonly values: readonly string[] } };
export type Family = 'json';

export const said = (scope: string, measure: string, values: readonly string[]): Row => ({ scope, measure, role: 'reads', bound: { kind: 'enumerated', values } });

/** The document the bytes hold, or nothing when they hold no JSON. */
export const documentOf = (bytes: Uint8Array): unknown => {
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return undefined;
  }
};
