const decode: Record<string, string> = {
  '1': 'PERSONA NATURAL',
  '2': 'PERSONA JURIDICA',
};

const encode: Record<string, string> = Object.fromEntries(Object.entries(decode).map(([key, value]) => [value, key]));

export const entityTypeMap: Record<string, Record<string, string>> = {
  encode,
  decode,
};
