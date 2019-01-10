/*
 * Migration template
 * 
 * add default for user_account birth_year
 */



ALTER TABLE user_account 
  ALTER birth_year SET DEFAULT NULL;
