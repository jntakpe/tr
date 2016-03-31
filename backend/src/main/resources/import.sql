--@formatter:off

-- Table Collaborateur

INSERT INTO collaborateur (login, created_by, created_date) VALUES ('jntakpe', 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO collaborateur (login, created_by, created_date) VALUES ('gpeel', 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO collaborateur (login, created_by, created_date) VALUES ('sbourret', 'gpeel', CURRENT_TIMESTAMP);

-- Table Training

INSERT INTO training (name, duration, created_by, created_date) VALUES ('hibernate', 3, 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('spring', 3, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('angularJS', 3, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('javascript', 3, 'sbourret', CURRENT_TIMESTAMP);

-- Table Location

INSERT INTO location (name, created_by, created_date) VALUES ('paris triangle', 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO location (name, created_by, created_date) VALUES ('toulouse colo1', 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO location (name, created_by, created_date) VALUES ('lille madeleine', 'jntakpe', CURRENT_TIMESTAMP);

-- Table Session

INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'paris triangle'), (SELECT id FROM training WHERE name='hibernate'), (SELECT id FROM collaborateur WHERE login='gpeel'), 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'paris triangle'), (SELECT id FROM training WHERE name='spring'), (SELECT id FROM collaborateur WHERE login='gpeel'), 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'toulouse colo1'), (SELECT id FROM training WHERE name='spring'), (SELECT id FROM collaborateur WHERE login='jntakpe'), 'jntakpe', CURRENT_TIMESTAMP);

--@formatter:on