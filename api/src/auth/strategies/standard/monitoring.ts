/*
 * Monitoring of expired keys
 */
import * as Knex from 'knex';
import * as IoRedis from 'ioredis';
import { UserSessionRecords } from '../../../models/user_session_record';


export const monitorSessionExpiry = (knex: Knex, url: string) => {
  const client = new IoRedis(url);

  // Subscribe to the "expired" key event to be notified when
  // session IDs expire
  // Note: Use "psubscribe" instead of subscribe to allow subscribing
  //       to patterns (note the "*")
  client.psubscribe('__keyevent@*__:expired');

  // Attach listener to the "pmessage" event which returns events that
  // are subscribed to using "psubscribe"
  // Note: need to cast second argument to <any> because `ioredis` typings
  //       are bad and wrong.
  client.on('pmessage', <any> ((...args: any[]) => {
    switch (args[0]) {
      case '__keyevent@*__:expired':
        UserSessionRecords.endSession(knex, args[2], 'expired');
        break;

      default:
        break;
    }
  }));

  // Return client so we can clean up after ourselves
  return client;
};
