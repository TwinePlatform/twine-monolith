import { createHash } from 'crypto';

export const hashJSON = (json: any) =>
  createHash('SHA256').update(JSON.stringify(json)).digest('hex');
