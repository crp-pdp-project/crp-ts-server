const decode: Record<string, string> = {
  '1': 'SOLO PEAS',
  '2': 'PEAS Y COMPLEMENTARIO',
  '3': 'SOLO COMPLEMENTARIO',
  '4': 'PLAN ESPECIFICO',
  '5': 'SCTR',
  '6': 'PARTE DEL PEAS',
  '7': 'PARTE DEL PEAS Y COMPLEMENTARIO',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const planTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
