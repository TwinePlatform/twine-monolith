import * as Knex from 'knex';
import * as IoRedis from 'ioredis';
import { UserSessionRecords } from '../../../models/user_session_record';


export const createListener = (knex: Knex, url: string) => {
  const client = new IoRedis(url);

  client.psubscribe('__keyevent@*__:expired', <any> ((...args: any[]) => {
    console.log('SUBBED', ...args);
  }));

  client.on('pmessage', <any> (async (...args: any[]) => {
    console.log('MESSAGE', ...args);

    switch (args[0]) {
      case '__keyevent@*__:expired':
        const x = await UserSessionRecords.endSession(knex, args[2], 'expired');
        console.log('RECORDED', x);
        break;

      default:
        break;
    }
  }));

  return client;
};
