BEGIN; 

    TRUNCATE
polls
RESTART
IDENTITY CASCADE;

    INSERT INTO polls
    (uuid,city,zip)
    VALUES
    ("b0439de8-fc14-4f39-922a-ce2ac6663a6b", "Seattle", NULL)



      COMMIT;      


