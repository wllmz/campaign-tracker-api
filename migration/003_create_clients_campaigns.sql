CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name VARCHAR(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX clients_name_unique ON clients (lower(name));

CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name VARCHAR(255) NOT NULL,
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE RESTRICT,
  chef_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX campaigns_client_name_unique ON campaigns (client_id, lower(name));