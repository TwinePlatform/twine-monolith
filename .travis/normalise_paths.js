const fs = require('fs');
const path = require('path');


const normaliseFilePath = (fpath) => {
  if (fpath.startsWith(ROOT)) {
    return fpath;
  }

  if (fpath.startsWith(APP_DIR)) {
    return path.join(ROOT, fpath);
  }

  if (fpath.startsWith('src')) {
    return path.join(ROOT, APP_DIR, fpath);
  }

  return fpath;
}

const APP_DIR = process.env.APP_DIR;
const [SCRIPT_PATH, ARG] = process.argv.slice(1);
const ROOT = path.resolve('..', SCRIPT_PATH);
console.log(ARG);

const json = require(ARG);

const newJson = {
  ...json,
  source_files: json.source_files.map((file) => ({
    ...file,
    name: normaliseFilePath(file.name),
  }))
}

fs.writeFileSync(ARG, JSON.stringify(newJson), 'utf-8');
