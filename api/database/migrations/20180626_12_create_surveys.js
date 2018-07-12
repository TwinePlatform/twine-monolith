const { buildQueryFromFile } = require('../util');
exports.up = buildQueryFromFile(__filename);
exports.down = () => {};
