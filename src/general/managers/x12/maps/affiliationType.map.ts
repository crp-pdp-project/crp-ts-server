const decode: Record<string, string> = {
  '1': 'REGULAR',
  '2': 'SCTR',
  '3': 'POTESTATIVO (INDEPENDIENTE)',
  '4': 'SCTR INDEPENDIENTE',
  '5': 'COMPLEMENTARIO',
  '6': 'SOAT',
  '8': 'SUBSIDIADO',
  '9': 'SEMI CONTRIBUTIVO',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const affiliationTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
