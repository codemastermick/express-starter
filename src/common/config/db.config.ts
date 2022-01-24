const { DB_USER, DB_PASSWORD, DB_HOST, DB_LOCAL_PORT, DB_DATABASE } =
  process.env;

export const dbConnectionUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_LOCAL_PORT}/${DB_DATABASE}?authSource=admin`;
