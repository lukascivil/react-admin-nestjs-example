import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

config({ path: resolve(__dirname, '../.env') });

// Used only for migrations
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  subscribers: ['dist/subscriber/**/*{.ts,.js}'],
  migrationsTableName: 'migration_table'
});
