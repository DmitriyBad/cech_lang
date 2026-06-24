import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    base: "/cech_lang/",
    plugins: [react()],
});
