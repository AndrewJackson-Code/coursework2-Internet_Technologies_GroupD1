declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            FINDWORK_API_TOKEN: string;
        }
    }
}

export {}