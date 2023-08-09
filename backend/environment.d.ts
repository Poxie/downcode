declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            DB_PORT: string;
            DB_HOST: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_DATABASE: string;
            API_PORT: string;
            JWT_PRIVATE_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}