import * as Knex from 'knex';
import * as IoRedis from 'ioredis';
import { UserSessionRecords } from '../../../models/user_session_record';


export const createListener = (knex: Knex, url: string) => {
  const client = new IoRedis(url);

  client.psubscribe('__keyevent@*__:expired');

  client.on('pmessage', <any> ((...args: any[]) => {
    switch (args[0]) {
      case '__keyevent@*__:expired':
        UserSessionRecords.endSession(knex, args[2], 'expired');
        break;

      default:
        break;
    }
  }));

  return client;
};
