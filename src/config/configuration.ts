import { registerAs } from "@nestjs/config";
import * as PACKAGE_JSON from '../../package.json';

export default registerAs('config', () => {
    return {
        proyect: {
            name: PACKAGE_JSON.name,
            version: PACKAGE_JSON.version,
            description: PACKAGE_JSON.description,
        },
        server: {
            port: parseInt(process.env.PORT, 10) || 3000,
            context: process.env.CONTEXT || '/api',
        },
        swagger: {
            enabled: process.env.SWAGGER_ENABLED === 'true',
            path: process.env.SWAGGER_PATH || '/api/docs',
        },
        database: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        },
        services: {
            apiLegaland: process.env.API_LEGALAND_URL,
        },
        params: {
            exchangeActivateSpreadPersons: process.env.EXCHANGE_ACTIVATE_SPREAD_PERSONS === "true"
        },
        auth: {
            jwtSecret: process.env.JWT_SECRET_KEY,
            jwtExpiresIn: process.env.JWT_EXPIRES_IN
        }
    };
});
