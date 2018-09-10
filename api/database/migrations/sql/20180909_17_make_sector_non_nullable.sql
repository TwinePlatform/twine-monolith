/*
 * Make `community_business_sector_id` non nullable
 */

/*
 * Row updates to enforce constraints
 */
UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Environment or nature'
  )
WHERE organisation_id = 9;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Food catering or production (incl. farming)'
  )
WHERE organisation_id = 32;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Sport & leisure'
  )
WHERE organisation_id = 44;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Sport & leisure'
  )
WHERE organisation_id = 46;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Energy'
  )
WHERE organisation_id = 57;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Environment or nature'
  )
WHERE organisation_id = 59;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Energy'
  )
WHERE organisation_id = 61;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Energy'
  )
WHERE organisation_id = 65;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Art centre or facility'
  )
WHERE organisation_id = 74;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Sport & leisure'
  )
WHERE organisation_id = 82;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Art centre or facility'
  )
WHERE organisation_id = 89;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Food catering or production (incl. farming)'
  )
WHERE organisation_id = 98;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Sports & leisure'
  )
WHERE organisation_id = 107;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Art centre or facility'
  )
WHERE organisation_id = 110;

UPDATE community_business
SET
  community_business_sector_id = (
    SELECT community_business_sector_id
    FROM community_business_sector
    WHERE sector_name = 'Energy'
  )
WHERE organisation_id = 112;

/*
 * Table Alterations
 */
ALTER TABLE community_business
  ALTER COLUMN community_business_sector_id SET NOT NULL;
