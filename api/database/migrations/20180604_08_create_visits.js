const { buildQueryFromFile } = require('../utils');

exports.up = buildQueryFromFile(__filename);
exports.down = () => {};
