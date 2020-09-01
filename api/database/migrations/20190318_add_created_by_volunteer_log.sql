/*
 * Migration add created_by column to volunteer_hours_log table
 */

ALTER TABLE volunteer_hours_log ADD created_by INT DEFAULT NULL;

ALTER TABLE volunteer_hours_log ADD CONSTRAINT volunteer_hours_log_created_by_to_user_fk   FOREIGN KEY (created_by) REFERENCES user_account(user_account_id) ON DELETE CASCADE;
