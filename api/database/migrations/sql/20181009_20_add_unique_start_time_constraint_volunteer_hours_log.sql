/*
 * Add unique start time constraint on volunteer_hours_log
 *
 * User should not be able to register multiple logs that have identical
 * start times.
 */
ALTER TABLE volunteer_hours_log
  ADD CONSTRAINT volunteer_hours_log_no_duplicate_start_times UNIQUE (user_account_id, started_at);
