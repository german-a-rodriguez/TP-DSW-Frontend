// Importamos las utilidades de Playwright para escribir pruebas y validar elementos en el navegador
import { test, expect, type Page } from '@playwright/test';



//
// TEST E2E: INGRESO DE UN ADMIN AL SISTEMA, CREACION DE UN ENTRENADOR, CHEKEO DE CREACIÓN Y LOG OUT.
//



// Credenciales de prueba del administrador para la demostración
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASS = 'admin1234';

// Datos del entrenador que se va a dar de alta en el sistema
const ENTRENADOR = {
  rolValue: 'entrenador',
  nombre: 'José',
  apellido: 'Suarez',
  nombreUsuario: 'jose_su',
  email: 'js@email.com',
  contrasenia: 'qwe123qwe',
  // Los inputs <input type="date"> reciben fechas en formato ISO (AAAA-MM-DD)
  fechaNacimientoIso: '2002-04-12',
  telefono: '3215666888',
};

// Busca el contenedor .campo-form que incluye un <label> con el texto indicado
function campoPorEtiqueta(page: Page, textoLabel: string | RegExp) {
  return page.locator('.campo-form').filter({ has: page.locator('label', { hasText: textoLabel }) });
}

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

  // Verificamos que exista el token y que tenga las 3 partes típicas de un JWT (header.payload.signature)
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

test('Administrador crea un entrenador, valida su alta y cierra sesión', async ({ page }) => {
  // 1. Iniciar sesión como administrador y comprobar el token JWT
  await loginComoAdminYValidarToken(page);

  // 2. Completar el formulario de nuevo usuario con rol entrenador
  await campoPorEtiqueta(page, /^Rol:/i).locator('select').selectOption(ENTRENADOR.rolValue);
  await campoPorEtiqueta(page, /^Nombre:/i).locator('input').fill(ENTRENADOR.nombre);
  await campoPorEtiqueta(page, /^Apellido:/i).locator('input').fill(ENTRENADOR.apellido);
  await campoPorEtiqueta(page, /^Nombre de Usuario:/i).locator('input').fill(ENTRENADOR.nombreUsuario);
  await campoPorEtiqueta(page, /^Email:/i).locator('input').fill(ENTRENADOR.email);
  await campoPorEtiqueta(page, /^Contraseña/i).locator('input').fill(ENTRENADOR.contrasenia);
  await campoPorEtiqueta(page, /^Fecha de Nacimiento:/i).locator('input').fill(ENTRENADOR.fechaNacimientoIso);
  await campoPorEtiqueta(page, /^Teléfono/i).locator('input').fill(ENTRENADOR.telefono);

  // 3. Enviar el formulario para crear el entrenador
  await page.getByRole('button', { name: 'Crear Usuario' }).click();

  // 4. Validar mensaje de éxito y que la nueva fila aparezca en la tabla de usuarios
  await expect(page.getByText('Usuario creado correctamente')).toBeVisible();
  const filaCreada = page.locator('tbody tr').filter({ hasText: ENTRENADOR.email });
  await expect(filaCreada).toBeVisible();
  await expect(filaCreada).toContainText(ENTRENADOR.nombreUsuario);
  await expect(filaCreada).toContainText(ENTRENADOR.rolValue);

  // 5. Cerrar sesión al finalizar la prueba
  await cerrarSesion(page);
});