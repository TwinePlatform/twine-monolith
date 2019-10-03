const fs = require('fs');
const path = require('path');


const normaliseFilePath = (fpath) => {
  return path.join(APP_DIR, fpath);
}

const APP_DIR = process.env.APP_DIR;
const [ARG] = process.argv.slice(2);

const json = require(ARG);

const newJson = {
  ...json,
  source_files: json.source_files.map((file) => ({
    ...file,
    name: normaliseFilePath(file.name),
  }))
}

fs.writeFileSync(ARG, JSON.stringify(newJson), 'utf-8');
