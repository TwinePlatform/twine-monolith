import * as Knex from 'knex';
import * as IoRedis from 'ioredis';
import { UserSessionRecords } from '../../../models/user_session_record';


export const createListener = (knex: Knex, url: string) => {
  const client = new IoRedis(url);

  client.subscribe('__keyevent@0__:expired');

  client.on('message', <any> (async (...args: any[]) => {
    console.log('MESSAGE', ...args);

    switch (args[0]) {
      case '__keyevent@0__:expired':
        UserSessionRecords.endSession(knex, args[1], 'expired');
        break;

      default:
        break;
    }
  }));

  return client;
};
