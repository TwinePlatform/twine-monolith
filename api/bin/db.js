#!/usr/bin/env node
const parse = require('minimist');
const db = require('../database');

const { _: args } = parse(process.argv.slice(2));

const [mod, command] = args[0].split(':');

db[mod][command](...args.slice(1));
