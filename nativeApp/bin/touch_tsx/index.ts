/*
 * Command line utility for a creating a blank template for components
 *
 * Usage:
 *  npm run touch:tsx [PATH] [FILE (optional)]
 *
 * If no file is supplied:
 * - directory is created (if does not exist)
 * - index file is created inside directory
 *
 * If file is supplied
 * - file is created inside of directory
 *
 * args:
 *  PATH: path from root where the folder should be created
 *  eg. ./src/open_views/screens/ForgotPassword
 *
 * FILE: capitalised component name
 *
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import getTemplate from './template';

const capitaliseFirst = (string) => string.charAt(0).toUpperCase() + string.substring(1);

const [path, file] = process.argv.slice(2);
if (file) {
  const fileName = capitaliseFirst(file);
  writeFileSync(`${path}/${fileName}.tsx`, getTemplate(fileName), { flag: 'wx' });
} else {
  const fileName = capitaliseFirst(path.split('/').slice(-1)[0]);

  !existsSync(path) && mkdirSync(`${path}`); //eslint-disable-line
  writeFileSync(`${path}/index.tsx`, getTemplate(fileName), { flag: 'wx' });
}

console.log('🎉 File has been created');
