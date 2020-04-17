BEGIN;

    TRUNCATE restaurants
RESTART IDENTITY CASCADE;

INSERT INTO restaurants
    (id, poll_id,name,address,city,state,area,postal_code,country,phone,lat,lng,
    price,reserve_url,mobile_reserve_url,image_url)
VALUES
    (149359, 'e81244eb-8a20-451a-8b2d-3fa81d60f29b', 'Farrelli''s Wood Fire Pizza-Frederickson',
    '5612 176th St, Ste E','Puyallup','WA','Seattle / Eastern Washington','98375','US',
    '2536555191',47.096306,-122.3355918,2,
    'http://www.opentable.com/single.aspx?rid=149359',
    'http://mobile.opentable.com/opentable/?restId=149359',
    'https://www.opentable.com/img/restimages/149359.jpg');

        COMMIT;