import * as path from 'path';
import { envOr } from './util';
import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';


const config: DeepPartial<Config> = {
    env: Environment.DEVELOPMENT,
    web: {
        // address: envOr('HOST_ADDRESS', 'localhost','172.20.10.2'),
        // address: envOr('HOST_ADDRESS', '172.20.10.2'),
        address: envOr('HOST_ADDRESS', '192.168.1.91'),
        port: 4000,
        routes: {
            cors: { // Local dev servers for:
                origin: [
                    'http://localhost:3000', // Visitor App
                    'http://localhost:8100', // Volunteer App
                    'http://localhost:3100', // Dashboard
                    'http://localhost:3200', // Admin App
                ],
            },
        },
    },
    knex: {
        connection: process.env.DATABASE_URL_DEVELOPMENT,
        seeds: {
            directory: path.resolve(process.cwd(), 'database', 'data', 'seed', 'development'),
        },
    },
    email: {
        postmarkKey: process.env.POSTMARK_KEY_DEVELOPMENT,
    },
    auth: {
        schema: {
            session_cookie: {
                options: {
                    cookieOptions: {
                        isSecure: true,
                    },
                    cache: {
                        cache: 'session', // Must match one of the caches
                        expiresIn: 1 * 24 * 60 * 60 * 1000,
                    },
                },
            },
        },
    },
    cache: {
        session: {
            name: 'session',
            options: { url: envOr('REDIS_URL_DEVELOPMENT', 'redis://localhost:6379') },
        },
    },
};

export default config;