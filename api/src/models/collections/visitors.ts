import { Users } from './users';
import { VisitorCollection } from '../types/index';

// export Visitors
export const Visitors: VisitorCollection = {
  _toColumnNames: Users._toColumnNames,
  cast: Users.cast,
  serialise: Users.serialise,
  exists: Users.exists,
  get: Users.get,
  getOne: Users.getOne,
  create: Users.create,
  update: Users.update,
  delete: Users.delete,
  destroy: Users.destroy,

  async getWithVisits(client, communityBusiness, query, activity) {

  },
};
