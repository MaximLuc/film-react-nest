// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs/promises');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg');

async function ensureSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS films (
      id uuid PRIMARY KEY,
      rating double precision NOT NULL,
      director varchar NOT NULL,
      tags text[] NOT NULL DEFAULT ARRAY[]::text[],
      image varchar NOT NULL,
      cover varchar NOT NULL,
      title varchar NOT NULL,
      about text NOT NULL,
      description text NOT NULL
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS schedules (
      id uuid PRIMARY KEY,
      daytime varchar NOT NULL,
      hall int NOT NULL,
      rows int NOT NULL,
      seats int NOT NULL,
      price int NOT NULL,
      taken text[] NOT NULL DEFAULT ARRAY[]::text[],
      film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_schedules_film_id
    ON schedules (film_id)
  `);
}

async function loadStubData() {
  const stubPath = path.join(
    __dirname,
    '..',
    'test',
    'mongodb_initial_stub.json',
  );
  const raw = await fs.readFile(stubPath, 'utf8');
  return JSON.parse(raw);
}

async function importData(client, films) {
  for (const film of films) {
    await client.query(
      `
        INSERT INTO films (
          id, rating, director, tags, image, cover, title, about, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          rating = EXCLUDED.rating,
          director = EXCLUDED.director,
          tags = EXCLUDED.tags,
          image = EXCLUDED.image,
          cover = EXCLUDED.cover,
          title = EXCLUDED.title,
          about = EXCLUDED.about,
          description = EXCLUDED.description
      `,
      [
        film.id,
        film.rating,
        film.director,
        film.tags ?? [],
        film.image,
        film.cover,
        film.title,
        film.about,
        film.description,
      ],
    );

    for (const schedule of film.schedule ?? []) {
      await client.query(
        `
          INSERT INTO schedules (
            id, daytime, hall, rows, seats, price, taken, film_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            daytime = EXCLUDED.daytime,
            hall = EXCLUDED.hall,
            rows = EXCLUDED.rows,
            seats = EXCLUDED.seats,
            price = EXCLUDED.price,
            taken = EXCLUDED.taken,
            film_id = EXCLUDED.film_id
        `,
        [
          schedule.id,
          schedule.daytime,
          schedule.hall,
          schedule.rows,
          schedule.seats,
          schedule.price,
          schedule.taken ?? [],
          film.id,
        ],
      );
    }
  }
}

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    database: process.env.DATABASE_NAME || 'practicum',
    user: process.env.DATABASE_USERNAME || 'film_user',
    password: process.env.DATABASE_PASSWORD || 'admin',
  });

  const films = await loadStubData();

  await client.connect();
  await client.query('BEGIN');

  try {
    await ensureSchema(client);
    await importData(client, films);
    await client.query('COMMIT');
    console.log(`Imported ${films.length} films`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
