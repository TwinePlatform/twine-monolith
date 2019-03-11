import * as fs from 'fs';
import { promisify } from 'util';
const csv = require('csv');


const stringify = promisify(csv.stringify);


export default async (headers: string[], data: object[], fileName: string) => {
  const result = await stringify(data, { columns: headers, header: true, quoted: true });
  fs.writeFileSync(fileName, result, { encoding: 'utf8' });
};
