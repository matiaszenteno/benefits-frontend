/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  // más variables de entorno si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 