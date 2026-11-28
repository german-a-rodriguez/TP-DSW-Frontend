// Importamos las utilidades de Playwright para escribir pruebas y validar elementos en el navegador
import { test, expect, type Page } from '@playwright/test';



//
// TEST E2E: INGRESO DE UN ADMIN AL SISTEMA, ELIMINACIÓN DEL ENTRENADOR CREADO EN EL TEST 'admin-crear-entrenador.spec.ts',
// CHEKEO DE ELIMINACIÓN Y LOG OUT.
//



// Credenciales del administrador para ingresar al panel
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASS = 'admin1234';

// Email del entrenador de prueba que se va a eliminar de la lista
const ENTRENADOR_EMAIL = 'js@email.com';

// Paso compartido: inicia sesión como admin, comprueba el JWT y verifica que cargue el panel
async function loginComoAdminYValidarToken(page: Page) {
  // Abrimos la portada de la aplicación
  await page.goto('/');

  // Vamos a la pantalla de login desde la barra de navegación superior
  await page
    .getByRole('navigation', { name: 'Acceso' })
    .getByRole('button', { name: 'Iniciar Sesión' })
    .click();

  // Completamos correo y contraseña del administrador y enviamos el formulario
  await page.getByLabel('Correo electrónico').fill(ADMIN_EMAIL);
  await page.getByLabel('Contraseña').fill(ADMIN_PASS);
  await page.getByRole('button', { name: 'Ingresar' }).click();

  // Esperamos a que el login guarde un token en localStorage
  await page.waitForFunction(() => Boolean(localStorage.getItem('token')));
  const token = await page.evaluate(() => localStorage.getItem('token'));

  // Verificamos que exista el token y que tenga formato de JWT (3 segmentos separados por punto)
  expect(token).toBeTruthy();
  expect(token?.split('.')).toHaveLength(3);

  // Confirmamos que entramos al panel de administración y que se muestra el listado de usuarios
  await expect(page.getByText('ADMINISTRADOR',{ exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Listado de Usuarios' })).toBeVisible();
}

// Paso compartido: cierra la sesión y verifica el regreso a la vista pública
async function cerrarSesion(page: Page) {
  await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
  await expect(page.getByRole('navigation', { name: 'Acceso' })).toBeVisible();
}

test('Administrador elimina un entrenador de la lista, valida su baja y cierra sesión', async ({ page }) => {
  // 1. Preparar la aceptación automática del window.confirm que dispara UsuariosCrud al eliminar
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  // 2. Iniciar sesión como administrador y comprobar el token JWT
  await loginComoAdminYValidarToken(page);

  // 3. Ubicar la fila correspondiente al entrenador en la tabla y hacer clic en Eliminar
  const filaUsuario = page.locator('tbody tr').filter({ hasText: ENTRENADOR_EMAIL });
  await expect(filaUsuario).toBeVisible();
  await filaUsuario.getByRole('button', { name: 'Eliminar' }).click();

  // 4. Validar el mensaje de confirmación y que la fila ya no exista en la tabla
  await expect(page.getByText('Usuario eliminado')).toBeVisible();
  await expect(page.locator('tbody tr').filter({ hasText: ENTRENADOR_EMAIL })).toHaveCount(0);

  // 5. Cerrar sesión al finalizar la prueba
  await cerrarSesion(page);
});