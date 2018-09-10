/*
 * Make `community_business_region_id` non nullable
 */

/*
 * Row updates to enforce constraints
 */
UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'West Midlands'
    )
WHERE organisation_id = 26;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'South West'
    )
WHERE organisation_id = 55;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'London'
    )
WHERE organisation_id = 94;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'South East'
    )
WHERE organisation_id = 127;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'North West'
    )
WHERE organisation_id = 129;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'London'
    )
WHERE organisation_id = 130;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'North East'
    )
WHERE organisation_id = 159;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'Yorkshire and the Humber'
    )
WHERE organisation_id = 160;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'North East'
    )
WHERE organisation_id = 161;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'Yorkshire and the Humber'
    )
WHERE organisation_id = 162;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'London'
    )
WHERE organisation_id = 163;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'West Midlands'
    )
WHERE organisation_id = 166;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'North West'
    )
WHERE organisation_id = 167;

UPDATE community_business
SET
  community_business_region_id = (
    SELECT community_business_region_id
    FROM community_business_region
    WHERE region_name = 'South East'
    )
WHERE organisation_id = 168;

/*
 * Table Alterations
 */
ALTER TABLE community_business
  ALTER COLUMN community_business_region_id SET NOT NULL;
