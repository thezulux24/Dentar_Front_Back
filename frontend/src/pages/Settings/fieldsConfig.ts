export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  editable: boolean;
  roles: ("paciente" | "doctor" | "auxiliar")[];
  gridSpan: number;
  onlyOnEdit?: boolean;
}

const allRoles: ("paciente" | "doctor" | "auxiliar")[] = [
  "paciente",
  "doctor",
  "auxiliar",
];

export const fieldsConfig: FieldConfig[] = [
  {
    name: "nombres",
    label: "Nombre",
    type: "text",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "apellidos",
    label: "Apellidos",
    type: "text",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "informacion_personal",
    label: "Información personal",
    type: "text",
    editable: true,
    roles: allRoles,
    gridSpan: 12,
  },
  {
    name: "fecha_de_nacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "correo",
    label: "Correo electrónico",
    type: "email",
    editable: false,
    roles: allRoles,
    gridSpan: 6,
  },
  {
    name: "telefono",
    label: "Número de celular",
    type: "tel",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
  },
  {
    name: "direccion",
    label: "Dirección",
    type: "text",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "identificacion",
    label: "No. Identificación",
    type: "text",
    editable: true,
    roles: allRoles,
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "sede",
    label: "Sede",
    type: "text",
    editable: true,
    roles: ["doctor", "auxiliar"],
    gridSpan: 6,
    onlyOnEdit: false,
  },
  {
    name: "especialidad",
    label: "Estudios",
    type: "text",
    editable: true,
    roles: ["doctor", "auxiliar"],
    gridSpan: 12,
    onlyOnEdit: true,
  },
  {
    name: "alergias",
    label: "Alergias",
    type: "text",
    editable: true,
    roles: ["paciente"],
    gridSpan: 6,
    onlyOnEdit: false,
  },
  {
    name: "tratamientos_previos",
    label: "Tratamientos previos",
    type: "text",
    editable: true,
    roles: ["paciente"],
    gridSpan: 6,
    onlyOnEdit: true,
  },
  {
    name: "tolerante_anestesia",
    label: "Tolerante a anestesia",
    type: "text",
    editable: true,
    roles: ["paciente"],
    gridSpan: 6,
    onlyOnEdit: true,
  },
];
