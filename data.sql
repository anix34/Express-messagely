\c messagely

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone DEFAULT CURRENT_DATE NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_DATE NOT NULL,
    read_at timestamp with time zone DEFAULT CURRENT_DATE
);

INSERT INTO users (username, password, first_name, last_name, phone)
VALUES
 ('Esponjatron', 'Pass12', 'Peter', 'Moian', '+54 261 555645'),
 ('Esponjatron1', 'Pass123', 'Peter3', 'Moian2', '+542 261 555645'),
 ('Esponjatron2', 'ass123', 'Pet', 'Moian1', '+543 261 555645');

INSERT INTO messages (from_username, to_username, body)
VALUES
('Esponjatron', 'Esponjatron1', 'This is the bodyyyyyy'),
('Esponjatron2', 'Esponjatron', 'Hello there')