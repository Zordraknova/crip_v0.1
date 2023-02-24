
import { DataSourceOptions } from 'typeorm';



const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    synchronize: true,                                  //_____!!!!!!!! Don't use on production
    logging: true,
    entities: [],
    migrations: [],

};

export default config;



