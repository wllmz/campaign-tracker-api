import pg from "pg";
import { pool } from "../../db/pool.js";
import { ConflictError } from "../../error/conflict-error.js";
import type { CreateClientInput, Client } from "./schema.js";

const COLUMNS = "id, name, created_at, updated_at";

// INSERT : traduit les erreurs Postgres en erreurs métier, contrainte par contrainte.
// Une contrainte inconnue remonte telle quelle (500) : mieux qu'un message faux.
function toWriteError(err: unknown): unknown {
  if (!(err instanceof pg.DatabaseError)) {
    return err;
  }
  switch (err.constraint) {
    case "clients_name_unique":
      return new ConflictError("A client with this name already exists");
    default:
      return err;
  }
}

// Ordre alphabétique : la liste sert à remplir un menu déroulant
export const findAllClients = async (): Promise<Client[]> => {
  const result = await pool.query<Client>(
    `SELECT ${COLUMNS} FROM clients ORDER BY name`,
  );
  return result.rows;
};

export const createClient = async (
  input: CreateClientInput,
): Promise<Client> => {
  try {
    const result = await pool.query<Client>(
      `INSERT INTO clients (name)
       VALUES ($1)
       RETURNING ${COLUMNS}`,
      [input.name],
    );
    const client = result.rows[0];
    if (!client) {
      throw new Error("INSERT returned no row");
    }
    return client;
  } catch (err) {
    throw toWriteError(err);
  }
};
