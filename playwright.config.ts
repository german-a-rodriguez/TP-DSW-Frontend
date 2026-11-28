import { defineConfig } from '@playwright/test';

// Aquí se indica dónde están los tests E2E, cuál es la URL base del frontend y que levante o reutilice el servidor 
// de desarrollo de Vite antes de ejecutar las pruebas.

export default defineConfig({
  // Carpeta donde van a estar los tests End-to-End (separada de src/tests de Vitest)
  testDir: './e2e',
  use: {
    // Dirección local donde Vite levanta el frontend
    baseURL: 'http://localhost:5173',
    // Abre el navegador en segundo plano (headless)
    headless: true,
  },
  // Levanta automáticamente el servidor de Vite antes de ejecutar las pruebas
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});