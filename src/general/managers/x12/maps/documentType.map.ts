const decode: Record<string, string> = {
  '1': 'DNI',
  '2': 'CE',
  '3': 'PAS',
  '4': 'DIE',
  '5': 'CUI',
  '6': 'CNV',
  '7': 'SDI',
  '8': 'RUC',
  '9': 'NCO',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const documentTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
