CREATE TYPE Status AS ENUM ('pas commencé', 'en cours', 'en review', 'validé', 'livré');


CREATE TABLE deliverables (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  status Status NOT NULL DEFAULT 'pas commencé',
  campaign_id uuid NOT NULL REFERENCES campaigns (id) ON DELETE RESTRICT,
  format_id uuid NOT NULL REFERENCES formats (id) ON DELETE RESTRICT,
  country_id uuid NOT NULL REFERENCES countries (id) ON DELETE RESTRICT,
  assigned_to uuid REFERENCES users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX campaign_id_format_id_country_id_unique ON deliverables (campaign_id, format_id, country_id);