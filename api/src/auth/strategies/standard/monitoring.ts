/*
 * Monitoring of expired keys
 */
import * as Knex from 'knex';
import * as IoRedis from 'ioredis';
import { UserSessionRecords } from '../../../models/user_session_record';
import { silent } from 'twine-util/promises';


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
  client.on('pmessage', <any> ((channel: string, event: string, key: string) => {
    switch (channel) {
      case '__keyevent@*__:expired':
        silent(UserSessionRecords.endSession(knex, key, 'expired'));
        break;

      /* istanbul ignore next */
      default:
        break;
    }
  }));

  // Return cleanup function
  return () => client.quit();
};
