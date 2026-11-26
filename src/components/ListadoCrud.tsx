import { useId } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function ListadoCrud({
  titulo,
  filtros,
  children,
}: {
  titulo?: string;
  filtros?: ReactNode;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <section className="tarjeta listado-crud" aria-label={titulo ?? 'Listado de solicitudes'}>
      {titulo && <h3 id={id}>{titulo}</h3>}
      {filtros}
      <div
        className="listado-tabla-contenedor"
        role="region"
        aria-label={titulo ? undefined : 'Listado de solicitudes'}
        aria-labelledby={titulo ? id : undefined}
        tabIndex={0}
      >
        {children}
      </div>
    </section>
  );
}

const iconos = {
  editar: <><path d="m16 3 5 5-12 12-6 1 1-6Z" /><path d="m14 5 5 5" /></>,
  eliminar: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  detalle: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  disciplinas: <><path d="m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5" /></>,
  pago: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20m-14 6 3 3 5-5" /></>,
};

const colores = {
  editar: 'azul',
  eliminar: 'rojo',
  detalle: 'gris',
  disciplinas: 'naranja',
  pago: 'naranja',
};

export function AccionListado({
  accion,
  etiqueta,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  accion: keyof typeof iconos;
  etiqueta: string;
}) {
  return (
    <button
      {...props}
      type="button"
      className={`btn btn-${colores[accion]} accion-listado accion-listado-${accion}`}
      aria-label={etiqueta}
      title={etiqueta}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">{iconos[accion]}</svg>
      <span>{children}</span>
    </button>
  );
}
