/*
 * Add is_temp column
 */

ALTER TABLE organisation ADD is_temp BOOLEAN DEFAULT FALSE;
ALTER TABLE user_account ADD is_temp BOOLEAN DEFAULT FALSE;