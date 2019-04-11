import * as fs from 'fs';


export const sync = {
  read: (fpath: string) => fs.readFileSync(fpath, 'utf8'),
  write: (fpath: string, content: string) => fs.writeFileSync(fpath, content, { flag: 'wx' }),
};
