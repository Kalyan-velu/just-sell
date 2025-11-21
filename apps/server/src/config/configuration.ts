export interface ConfigType {
  pg: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
    maxAge?: number;
  };
}
export default (): ConfigType => ({
  pg: {
    host: process.env.PG_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? '5432'),
    username: process.env.PG_USERNAME ?? 'postgres',
    password: process.env.PG_PASSWORD ?? '',
    database: process.env.PG_DATABASE ?? 'justsell',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    maxAge: Number(process.env.JWT_MAX_AGE ?? '3600'),
  },
});
