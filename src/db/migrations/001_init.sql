CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS boards (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  owner_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  board_id    INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  title       VARCHAR(300) NOT NULL,
  description TEXT,
  status      VARCHAR(50) DEFAULT 'todo',
  assignee_id INTEGER REFERENCES users(id),
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);