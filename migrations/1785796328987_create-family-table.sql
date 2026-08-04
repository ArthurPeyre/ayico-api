-- Up Migration
CREATE TABLE authentication.families (
    id SERIAL PRIMARY KEY,
    name TEXT
);

ALTER TABLE authentication.users
    ADD COLUMN family_id INTEGER REFERENCES authentication.families(id) ON DELETE SET NULL;

-- Down Migration
ALTER TABLE authentication.users DROP COLUMN family_id;

DROP TABLE authentication.families;
