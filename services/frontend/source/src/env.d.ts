/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
