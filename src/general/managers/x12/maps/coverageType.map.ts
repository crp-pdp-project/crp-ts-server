const decode: Record<string, string> = {
  '0': 'NO APLICA (SEPELIO, PRESTACIONES ECONÓMICAS, ETC)',
  '1': 'EXTRA HOSPITALARIO',
  '2': 'MEDICO EN PLANTA',
  '3': 'MEDICINAS ALTERNATIVAS',
  '4': 'AMBULATORIO',
  '5': 'HOSPITALARIA',
  '6': 'EMERGENCIA',
  '8': 'INTEGRAL',
  '9': 'OTROS',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const coverageTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
