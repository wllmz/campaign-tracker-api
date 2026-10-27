CREATE table countries (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(2) CHECK (char_length(code) = 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX countries_name_unique ON countries (lower(name));
CREATE UNIQUE INDEX countries_code_unique ON countries (lower(code));

CREATE TABLE formats (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name VARCHAR(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX formats_name_unique ON formats (lower(name));