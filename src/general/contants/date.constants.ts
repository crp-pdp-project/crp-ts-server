export const dateFormats = {
  spanishDate: 'DD-MM-YYYY',
  dbDate: 'YYYY-MM-DD',
  inetumDate: 'YYYYMMDD',
} as const;

export const timeFormats = {
  spanishTime: 'HH:mm:ss',
  dbTime: 'HH:mm:ss',
  inetumTime: 'HHmmss',
} as const;

export const dateTimeFormats = {
  spanishDateTime: 'DD-MM-YYYY HH:mm:ss',
  dbDateTime: 'YYYY-MM-DD HH:mm:ss',
  inetumDateTime: 'YYYYMMDDHHmmss',
} as const;

export const allFormats = {
  ...dateFormats,
  ...timeFormats,
  ...dateTimeFormats,
} as const;
