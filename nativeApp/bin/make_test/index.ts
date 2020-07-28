/*
 * Command line utility for a creating a template for test files
 *
 * Usage:
 *  npm run touch:tsx [PATH]
 *
 * args:
 *  PATH: path of file to be tested
 *  eg. ./src/lib/utils/makeMagic.ts
 *
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import getTemplate from './template';

const [path] = process.argv.slice(2);

const directory = path
  .split('/').reverse()
  .splice(1).reverse()
  .join('/');
const testDirectory = `${directory}/__test__`;
const [fileName] = path
  .split('/')
  .splice(-1)
  .join()
  .split('.');

!existsSync(testDirectory) && mkdirSync(testDirectory); //eslint-disable-line
writeFileSync(`${testDirectory}/${fileName}.test.ts`, getTemplate(), { flag: 'wx' });

console.log('👷🏻‍♀️ Test file has been created');
