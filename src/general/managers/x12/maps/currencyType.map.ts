const decode: Record<string, string> = {
  '1': 'SOLES',
  '2': 'DOLARES',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const currencyTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
