-- Up Migration
CREATE FUNCTION authentication.delete_empty_family()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.family_id IS NOT NULL THEN
        DELETE FROM authentication.families
        WHERE id = OLD.family_id
        AND NOT EXISTS (
            SELECT 1 FROM authentication.users WHERE family_id = OLD.family_id
        );
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_empty_family
AFTER DELETE ON authentication.users
FOR EACH ROW
EXECUTE FUNCTION authentication.delete_empty_family();

-- Down Migration
DROP TRIGGER IF EXISTS trg_delete_empty_family ON authentication.users;
DROP FUNCTION IF EXISTS authentication.delete_empty_family();