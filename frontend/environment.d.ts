declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            CDN_HOST: string;
            NEXT_PUBLIC_BACKEND_ORIGIN: string;
            NEXT_PUBLIC_CDN_ORIGIN: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}