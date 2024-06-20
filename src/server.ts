import 'reflect-metadata';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import express, { Application } from 'express';
import schema from './schema';
import { AppDataSource } from './db';
import { resolvers } from './resolvers';

const app: Application = express();

AppDataSource.initialize().then(() => {

    const corsOptions = {
        origin: [
            'http://localhost:3000',
        ],
        credentials: true,
    };

    app.use(cors(corsOptions));

    app.use('/api', graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: true
    }));

    const PORT = 4000;

    app.listen(PORT, () => {
        console.log(`Сервер работает на порту ${PORT}`);
    });

}).catch((error) => console.log('Ошибка инициализации базы данных:', error));