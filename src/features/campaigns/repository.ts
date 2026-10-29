import pg from "pg";
import { pool } from "../../db/pool.js";
import { NotFoundError } from "../../error/not-found-error.js";
import { ConflictError } from "../../error/conflict-error.js";
import { InvalidReferenceError } from "../../error/invalid-reference-error.js";
import type { Campaign, CreateCampaignInput, UpdateCampaignInput } from "./schema.js";

const RESTRICT_VIOLATION = "23001";
const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";

const COLUMNS = "id, name, client_id, chef_id, created_at, updated_at";

// INSERT / UPDATE : traduit les erreurs Postgres en erreurs métier
function toWriteError(err: unknown): unknown {
  if (err instanceof pg.DatabaseError) {
    if (err.code === UNIQUE_VIOLATION) {
      return new ConflictError("A campaign with this name already exists for this client");
    }
    if (err.code === FOREIGN_KEY_VIOLATION) {
      return new InvalidReferenceError("Client or chef not found");
    }
  }
  return err;
}

export async function findAllCampaigns(): Promise<Campaign[]> {
  const result = await pool.query<Campaign>(
    `SELECT ${COLUMNS} FROM campaigns ORDER BY created_at DESC`,
  );
  return result.rows;
}

export async function findCampaignById(id: string): Promise<Campaign> {
  const result = await pool.query<Campaign>(
    `SELECT ${COLUMNS} FROM campaigns WHERE id = $1`,
    [id],
  );
  const campaign = result.rows[0];
  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }
  return campaign;
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  try {
    const result = await pool.query<Campaign>(
      `INSERT INTO campaigns (name, client_id, chef_id)
       VALUES ($1, $2, $3)
       RETURNING ${COLUMNS}`,
      [input.name, input.client_id, input.chef_id],
    );
    const campaign = result.rows[0];
    if (!campaign) {
      throw new Error("INSERT returned no row");
    }
    return campaign;
  } catch (err) {
    throw toWriteError(err);
  }
}

// COALESCE garde la valeur actuelle quand le champ n'est pas envoyé (null)
export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<Campaign> {
  let result: pg.QueryResult<Campaign>;
  try {
    result = await pool.query<Campaign>(
      `UPDATE campaigns
       SET name = COALESCE($2, name),
           client_id = COALESCE($3, client_id),
           chef_id = COALESCE($4, chef_id),
           updated_at = now()
       WHERE id = $1
       RETURNING ${COLUMNS}`,
      [id, input.name ?? null, input.client_id ?? null, input.chef_id ?? null],
    );
  } catch (err) {
    throw toWriteError(err);
  }
  const campaign = result.rows[0];
  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }
  return campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  let result: pg.QueryResult;
  try {
    result = await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);
  } catch (err) {
    // ON DELETE RESTRICT lève 23001 (pas 23503) : la campagne a encore des livrables
    if (err instanceof pg.DatabaseError && err.code === RESTRICT_VIOLATION) {
      throw new ConflictError("Campaign still has deliverables");
    }
    throw err;
  }
  if (result.rowCount === 0) {
    throw new NotFoundError("Campaign not found");
  }
}
