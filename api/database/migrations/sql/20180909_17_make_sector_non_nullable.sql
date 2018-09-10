/*
 * Make `community_business_sector_id` non nullable
 */

/*
 *
 */
INSERT INTO community_business_sector (sector_name) VALUES ('Unspecified');

/*
 * Row updates to enforce constraints
 */
UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Unspecified'
  )
WHERE organisation_id in (9, 44, 46, 57, 59, 61, 65, 74, 82, 89, 98, 107, 110, 112);

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Food catering or production (incl. farming)'
  )
WHERE organisation_id = 32;

/*
 * Table Alterations
 */
ALTER TABLE community_business
  ALTER COLUMN community_business_sector_id SET NOT NULL;
