// Constantes de autenticación JWT
export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

// Sonstantes de zona horaria y tiempo de la aplicación
export const TIMEZONE = 'America/Bogota';

// Constantes de paginación
export const PAGINATION_MAX_PAGE_SIZE = 100;
export const PAGINATION_DEFAULT_PAGE_SIZE = 20;

export const tiposParametros = [
  'estados_cita',
  'tipos_usuario',
  'metodos_pago',
  'estados_pago',
  'estados_tratamiento',
  'estados_mensaje',
  'tipos_admin',
  'tipos_auxiliar',
];
