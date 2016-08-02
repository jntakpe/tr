--@formatter:off

-- Table Employee

INSERT INTO employee (login, email, first_name, last_name, department, phone, location, password, last_ldap_check, created_by, created_date) VALUES ('jntakpe', 'jocelyn.ntakpe@soprasteria.com', 'Joss', 'N''takpe', '512 SF CRÉDIT AGRICOLE LBP BDF', '5 1394', 'TOULOUSE COLO 1 - B1&B2', '$2a$10$LH5vuBPe8OcsZ7nBwg7LpuRKGeaBZjdrfC6e6KME9fKn.fyzeldse', CURRENT_TIMESTAMP, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO employee (login, email, first_name, last_name, department, phone, location, password, last_ldap_check, created_by, created_date) VALUES ('gpeel', 'gauthier.peel@soprasteria.com', 'Gauthier', 'Peel', '042 DRH FORMATION ET DÉVELOPPEMENT', '4 7629', 'AIX PICHAURY', '$2a$10$LH5vuBPe8OcsZ7nBwg7LpuRKGeaBZjdrfC6e6KME9fKn.fyzeldse', CURRENT_TIMESTAMP, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO employee (login, email, first_name, last_name, department, phone, location, password, last_ldap_check, created_by, created_date) VALUES ('sbourret', 'sebastien.bourret@soprasteria.com', 'Sébastien', 'Bourret', '112 LYON INDUSTRIE', '4 5572', 'LYON LIMONEST', '$2a$10$VXqsdFTF802HGOoaA/dO/ehomvjEItM8HabUIU1.TaDUEt5fMMnR2', '2015-01-01 00:00:00.751000', 'jntakpe', CURRENT_TIMESTAMP);

-- Table Training

INSERT INTO training (name, duration, created_by, created_date) VALUES ('hibernate', 3, 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('spring', 3, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('angularJS', 3, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('javascript', 3, 'sbourret', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('js + angular', 4, 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO training (name, duration, created_by, created_date) VALUES ('angular 2', 3, 'jntakpe', CURRENT_TIMESTAMP);

-- Table Location

INSERT INTO location (name, city, created_by, created_date) VALUES ('triangle', 'Paris', 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO location (name, city, created_by, created_date) VALUES ('matei', 'Paris','jntakpe', CURRENT_TIMESTAMP);
INSERT INTO location (name, city, created_by, created_date) VALUES ('colo1', 'Toulouse','jntakpe', CURRENT_TIMESTAMP);
INSERT INTO location (name, city, created_by, created_date) VALUES ('colo2', 'Toulouse','jntakpe', CURRENT_TIMESTAMP);
INSERT INTO location (name, city, created_by, created_date) VALUES ('madeleine', 'Lille','jntakpe', CURRENT_TIMESTAMP);
INSERT INTO location (name, city, created_by, created_date) VALUES ('urban', 'Lille','jntakpe', CURRENT_TIMESTAMP);

-- Table Session

INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'triangle' AND city='Paris'), (SELECT id FROM training WHERE name='hibernate'), (SELECT id FROM employee WHERE login='gpeel'), 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'triangle' AND city='Paris'), (SELECT id FROM training WHERE name='spring'), (SELECT id FROM employee WHERE login='gpeel'), 'gpeel', CURRENT_TIMESTAMP);
INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'colo1' AND city='Toulouse'), (SELECT id FROM training WHERE name='spring'), (SELECT id FROM employee WHERE login='jntakpe'), 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO session (start, location_id, training_id, trainer_id, created_by, created_date) VALUES (CURRENT_DATE, (SELECT id FROM location WHERE name = 'colo1' AND city='Toulouse'), (SELECT id FROM training WHERE name='angularJS'), (SELECT id FROM employee WHERE login='jntakpe'), 'jntakpe', CURRENT_TIMESTAMP);

-- Table Rating

INSERT INTO rating (animation, cons, documentation, exercices, pratice, pros, subject, suggests, theory, anonymous, employee_id, session_id, created_by, created_date) VALUES (3, 'cannot get trainer phone number', 3, 3, 3, 'best training ever', 3, 3, 3, false, (SELECT id FROM employee WHERE login='gpeel'), (SELECT id FROM session LIMIT 1), 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO rating (animation, cons, documentation, exercices, pratice, pros, subject, suggests, theory, anonymous, employee_id, session_id, created_by, created_date) VALUES (0, 'cannot leave earlier', 0, 0, 0, 'worst training ever', 0, 0, 0, false, (SELECT id FROM employee WHERE login='sbourret'), (SELECT id FROM session LIMIT 1), 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO rating (animation, cons, documentation, exercices, pratice, pros, subject, suggests, theory, anonymous, employee_id, session_id, created_by, created_date) VALUES (3, 'cannot get trainer phone number', 3, 3, 3, 'best training ever', 3, 3, 3, false, (SELECT id FROM employee WHERE login='sbourret'), (SELECT id FROM session WHERE training_id=(SELECT id FROM training WHERE name='spring') LIMIT 1), 'jntakpe', CURRENT_TIMESTAMP);
INSERT INTO rating (animation, cons, documentation, exercices, pratice, pros, subject, suggests, theory, anonymous, employee_id, session_id, created_by, created_date) VALUES (3, 'cannot get trainer phone number', 3, 3, 3, 'best training ever', 3, 3, 3, false, (SELECT id FROM employee WHERE login='jntakpe'), (SELECT id FROM session WHERE training_id=(SELECT id FROM training WHERE name='angularJS') LIMIT 1), 'jntakpe', CURRENT_TIMESTAMP);

--@formatter:on