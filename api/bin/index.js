const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

(()=>{
  if (!process.argv[2]){
    console.log(chalk.red('Supply a file name')); 
    return;
  }

  if (process.argv[3]){
    console.log(chalk.red('Only supports one file name')); 
    return;
  }

  const scriptFiles = fs.readdirSync('./bin').map(x => path.parse(x));
  const matchingFile = scriptFiles.find(x => x.name === process.argv[2])

  if(!matchingFile){
    console.log(chalk.red('No matching filename')); 
    return;
  };

  if(matchingFile.ext !== '.ts'){
    console.log(chalk.red(
`This script only works for .ts files.
If your script is .js please run directly
in node.
    `)); 
    return;
  }

  console.log(chalk.blue('Running script...'))
  require(path.join(__dirname,'..','build','bin',matchingFile.name + '.js'))
})();
