/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APPOINTMENT_DURATION: number
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
