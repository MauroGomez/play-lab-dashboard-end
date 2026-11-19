import postgres from 'postgres';

const DATABASE_PREFIX = 'db-play-lab-';

export function getDatabaseName(config = process.env) {
  const group = config.POSTGRES_DB_USERNAME;
  if (!/^grupo[0-9]{2}$/.test(group ?? '')) {
    throw new Error('POSTGRES_DB_USERNAME debe tener la forma grupoNN. Ejemplo: grupo01.');
  }
  return `${DATABASE_PREFIX}${group}`;
}

export function getDatabaseOptions(database = getDatabaseName(), config = process.env) {
  for (const key of ['POSTGRES_DB_HOSTNAME', 'POSTGRES_DB_USERNAME', 'POSTGRES_DB_PASSWORD']) {
    if (!config[key]) throw new Error(`Falta ${key} en .env.`);
  }
  return {
    host: config.POSTGRES_DB_HOSTNAME,
    username: config.POSTGRES_DB_USERNAME,
    password: config.POSTGRES_DB_PASSWORD,
    database,
    ssl: 'require' as const,
  };
}

// Postgres.js abre las conexiones al ejecutar la primera consulta.
export const sql = postgres(getDatabaseOptions());
