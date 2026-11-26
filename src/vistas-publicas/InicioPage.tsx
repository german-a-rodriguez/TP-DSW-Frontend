interface InicioPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export function InicioPage({ onGoToLogin, onGoToRegister }: InicioPageProps) {
  return (
    <main>
      <section className="inicio-publico">
        <span className="inicio-etiqueta">NUEVA TEMPORADA</span>

        <h1>
          Forja tu <span className="texto-lima">Mejor Versión</span>
        </h1>

        <p className="inicio-descripcion">
          El sistema de entrenamiento definitivo. Rutinas personalizadas,
          gestión de tu membresía y clases para alcanzar tus objetivos.
        </p>

        <div className="inicio-acciones">
          <button
            onClick={onGoToRegister}
            className="btn btn-lima"
          >
            Comenzar Ahora
          </button>
          <button
            onClick={onGoToLogin}
            className="btn btn-gris"
          >
            Iniciar Sesión
          </button>
        </div>
      </section>

      {/* Presentación de las funciones disponibles para los clientes. */}
      <section className="inicio-beneficios">
        <div className="inicio-contenido">
          <h2>Todo lo que necesitás</h2>
          <p className="inicio-subtitulo">Rutinas, clases y tu membresía en un mismo lugar.</p>

          <div className="inicio-servicios">
            <article className="tarjeta">
              <div className="inicio-icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1" />
                </svg>
              </div>
              <h3>Rutinas personalizadas</h3>
              <p>
                Contanos tu objetivo y tus datos físicos para que un entrenador
                pueda asignarte una rutina.
              </p>
            </article>

            <article className="tarjeta">
              <div className="inicio-icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18M7 15h4" />
                </svg>
              </div>
              <h3>Tu membresía</h3>
              <p>
                Elegí un plan y consultá el estado y las fechas de tu membresía
                desde tu cuenta.
              </p>
            </article>

            <article className="tarjeta">
              <div className="inicio-icono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="9" cy="7" r="3" />
                  <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3" />
                </svg>
              </div>
              <h3>Clases grupales</h3>
              <p>
                Consultá las disciplinas, los horarios y los entrenadores.
                Encontrá una clase que se adapte a tu semana.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
