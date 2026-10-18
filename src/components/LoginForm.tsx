import { useState } from 'react';
import { parseJwt } from '../utils/auth';

interface LoginFormProps {
    onLoginSuccess: (token: string, rol: string) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {

    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = async (evento: React.SyntheticEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasenia }),
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');
            
            alert(data.message);

            // El backend devuelve el token en data.data
            const token = data.data;

            // Decodificamos el token para extraer el rol
            const decodedToken = parseJwt(token);
            const rol = decodedToken?.rol;

            // Guardamos en el localStorage del navegador para que no se pierda si recarga la página
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);

            // Notificamos a App.tsx
            onLoginSuccess(token, rol);

        } catch (error: unknown) {

            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocurrió un error desconocido');
            }
        }
    };

    return (
        <div className="form-card" style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>

            <h3 className="form-title">Iniciar sesión</h3>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLoginSubmit}>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                    <label className="input-label">Usuario</label>
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(evento) => setEmail(evento.target.value)} 
                        required 
                        className="form-input" 
                        placeholder="Ej: admin@email.com"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div className="input-group" style={{ marginBottom: '20px' }}>
                    <label className="input-label">Contraseña</label>
                    <input 
                        type="password" 
                        value={contrasenia} 
                        onChange={(evento) => setContrasenia(evento.target.value)} 
                        required 
                        className="form-input" 
                        placeholder="Ej: admin123"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button type="submit" className="btn-primary" /*style={{ width: '100%' }}*/
                        style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Iniciar Sesión
                </button>

            </form>
        </div>
    );
}