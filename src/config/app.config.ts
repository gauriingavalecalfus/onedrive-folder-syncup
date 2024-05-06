import { registerAs } from '@nestjs/config';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        env: process.env.APP_ENV || 'local',
        language: process.env.APP_LANGUAGE || 'en',
        http: {
            host: process.env.APP_HOST || '0.0.0.0',
            port: parseInt(process.env.APP_PORT) || 3000,
        },
    }),
);