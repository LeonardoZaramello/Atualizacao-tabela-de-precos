declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        MYSQL_PORT: number;
        // add more environment variables and their types here
      }
    }
  }

  export {}