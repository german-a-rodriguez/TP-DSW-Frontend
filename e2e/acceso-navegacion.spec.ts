// Importamos test y expect de Playwright para manejar el navegador y comprobar lo visible en pantalla
import { test, expect } from '@playwright/test';



//
// TEST END-TO-END (E2E): Abre la aplicación real en el navegador, escribe en los campos del formulario de login 
// y verifica la navegación hacia el registro.
//



test('flujo de acceso: va a inicio de sesión, completa datos y navega a registro', async ({ page }) => {
  // 1. Abrimos la raíz de la aplicación (renderiza InicioPage)
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Forja tu Mejor Versión' })).toBeVisible();

  // 2. Navegamos a la pantalla de inicio de sesión usando el botón de la barra superior
  await page.getByRole('navigation', { name: 'Acceso' }).getByRole('button', { name: 'Iniciar Sesión' }).click();

  // 3. Verificamos que cargue el encabezado de LoginPage
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

  // 4. Completamos correo y contraseña en el formulario real
  await page.getByLabel('Correo electrónico').fill('cliente@nexusgym.com');
  await page.getByLabel('Contraseña').fill('ClavePrueba123');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('cliente@nexusgym.com');
  await expect(page.getByLabel('Contraseña')).toHaveValue('ClavePrueba123');

  // 5. Hacemos clic en "Registrate" para comprobar la navegación a RegistroPage
  await page.getByRole('button', { name: 'Registrate' }).click();
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).not.toBeVisible();
});