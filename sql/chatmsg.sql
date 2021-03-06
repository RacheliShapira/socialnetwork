DROP TABLE IF EXISTS chatmsg;

CREATE TABLE chatmsg (
    id SERIAL PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
