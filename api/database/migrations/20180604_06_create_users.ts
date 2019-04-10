import { buildQueryFromFile } from '../utils';

exports.up = buildQueryFromFile(__filename);
exports.down = () => {};
