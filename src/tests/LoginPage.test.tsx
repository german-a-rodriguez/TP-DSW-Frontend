// Herramientas de Vitest para armar las pruebas y crear funciones espía (vi.fn)
import { describe, test, expect, vi, afterEach } from 'vitest';
// Herramientas de React Testing Library para renderizar el componente y simular clics/escritura
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
// Importamos el componente real de LoginPage
import { LoginPage } from '../vistas-publicas/LoginPage';



//
// TEST UNITARIO DEL COMPONENTE DE LOGIN
//

// Es un test unitario de frontend con Vitest y React Testing Library: renderizamos el componente LoginPage en 
// memoria (con jsdom, sin abrir un navegador real ni llamar al backend) y comprobamos que:
// muestre los campos del formulario, 
// que refleje mensajes de aviso recibidos por props,
// y que responda al escribir y hacer clic en 'Registrate'.



// Limpia el DOM simulado después de cada test para que no se mezclen elementos entre pruebas
afterEach(() => {
  cleanup();
});

describe('Componente LoginPage', () => {
  test('renderiza el título, los campos de correo y contraseña y el botón Ingresar', () => {
    // Renderizamos LoginPage pasando funciones falsas (vi.fn()) en las props obligatorias
    render(
      <LoginPage
        onLoginSuccess={vi.fn()}
        onGoToRegister={vi.fn()}
      />,
    );

    // Verificamos que aparezcan en pantalla los textos e inputs esperados
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeTruthy();
    expect(screen.getByLabelText('Correo electrónico')).toBeTruthy();
    expect(screen.getByLabelText('Contraseña')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeTruthy();
  });

  test('muestra el mensaje de avisoSesion cuando llega por props', () => {
    // Probamos que si la sesión venció y llega un aviso, el componente lo muestra al usuario
    render(
      <LoginPage
        avisoSesion="Tu sesión expiró. Volvé a ingresar."
        onLoginSuccess={vi.fn()}
        onGoToRegister={vi.fn()}
      />,
    );

    expect(screen.getByText('Tu sesión expiró. Volvé a ingresar.')).toBeTruthy();
  });

  test('permite escribir en los campos y llama a onGoToRegister al hacer clic en Registrate', () => {
    const mockGoToRegister = vi.fn();

    render(
      <LoginPage
        onLoginSuccess={vi.fn()}
        onGoToRegister={mockGoToRegister}
      />,
    );

    // Simulamos que el usuario escribe su email y contraseña
    const inputEmail = screen.getByLabelText('Correo electrónico') as HTMLInputElement;
    const inputPass = screen.getByLabelText('Contraseña') as HTMLInputElement;

    fireEvent.change(inputEmail, { target: { value: 'socio@nexusgym.com' } });
    fireEvent.change(inputPass, { target: { value: 'MiClave123' } });

    expect(inputEmail.value).toBe('socio@nexusgym.com');
    expect(inputPass.value).toBe('MiClave123');

    // Simulamos clic en el botón "Registrate" y verificamos que llame a la función recibida
    fireEvent.click(screen.getByRole('button', { name: 'Registrate' }));
    expect(mockGoToRegister).toHaveBeenCalledOnce();
  });
});