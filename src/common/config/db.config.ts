const { DB_CONNECTION_STRING } = process.env;

export const dbConnectionUrl = DB_CONNECTION_STRING as string;
// export const dbConnectionUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
