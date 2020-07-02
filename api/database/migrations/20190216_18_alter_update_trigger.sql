/*
 * Alter update trigger function
 *
 * Need to return NEW row instead of OLD row because DISTINCT check
 * on CITEXT rows doesn't detect casing changes.
 * See https://github.com/TwinePlatform/twine-api/issues/333
 */

CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
  IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
    NEW.modified_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';
