DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  readerid VARCHAR(200) NOT NULL CHECK (first <> ''),
  title VARCHAR(200) NOT NULL CHECK (first <> ''),
  author  VARCHAR(200) NOT NULL CHECK (last <> ''),
  coverurl VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
