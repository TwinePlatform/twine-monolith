/*
 * Command line utility for a creating a template for redux code
 * that handle requests
 *
 * Usage:
 *  npm run touch:tsx [entity]
 *
 * args:
 *  ENTITY: the concept redux is managing to be inserted into variable names
 *  eg. volunteers
 *
 */
import { writeFileSync } from 'fs';
import getTemplate from './template';

const [entity] = process.argv.slice(2);
if (!entity) {
  console.log('⚠️ Please supply an entity');
} else {
  const fileName = `./src/redux/${entity}.ts`;

  writeFileSync(fileName, getTemplate(entity), { flag: 'wx' });

  console.log('🎉 File has been created');
}
