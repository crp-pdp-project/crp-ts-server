const decode: Record<string, string> = {
  '1': 'VIGENTE',
  '2': 'SIN COBERTURA',
  '6': 'INACTIVO',
  '7': 'SUSPENDIDO',
  '8': 'LATENTE',
  '9': 'RENOVADA',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const statusTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
