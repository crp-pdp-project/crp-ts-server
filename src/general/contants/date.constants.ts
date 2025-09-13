export const dateConstants = {
  crpDate: 'DDMMYYYY',
  inetumDate: 'YYYYMMDD',
  spanishDate: 'DD-MM-YYYY',
  dbDate: 'YYYY-MM-DD',
} as const;

export const timeConstants = {
  crpTime: 'HHmmss',
  inetumTime: 'HHmmss',
  spanishTime: 'HH:mm:ss',
  dbTime: 'HH:mm:ss',
} as const;

export const dateTimeConstants = {
  crpDateTime: 'DDMMYYYYHHmmss',
  inetumDateTime: 'YYYYMMDDHHmmss',
  spanishDateTime: 'DD-MM-YYYY HH:mm:ss',
  dbDateTime: 'YYYY-MM-DD HH:mm:ss',
} as const;

export const allConstants = {
  ...dateConstants,
  ...timeConstants,
  ...dateTimeConstants,
} as const;
