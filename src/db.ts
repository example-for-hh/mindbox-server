import { DataSource } from 'typeorm';
import ormconfig from '../config/ormconfig.json';

export const AppDataSource = new DataSource(ormconfig as any);

AppDataSource.initialize()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Connection error', err.stack);
    });