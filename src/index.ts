import { readers } from '@lapxo/topos/capsule';
import { jsonCites } from './regions/json-cites.ts';
import { jsonSaid } from './regions/json-said.ts';

export const { observe, run } = readers({
  'json-cites': { reads: ['*.json'], observe: jsonCites },
  'json-said': { reads: ['*.json'], observe: jsonSaid },
});
