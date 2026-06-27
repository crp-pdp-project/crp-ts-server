const dateConstants = {
  crpDate: 'DDMMYYYY',
  crpDateShort: 'DDMMYY',
  inetumDate: 'YYYYMMDD',
  spanishDate: 'DD-MM-YYYY',
  spanishDateShort: 'MM-YYYY',
  dbDate: 'YYYY-MM-DD',
} as const;

const timeConstants = {
  crpTime: 'HHmmss',
  crpTimeShort: 'HHmm',
  inetumTime: 'HHmmss',
  spanishTime: 'HH:mm:ss',
  spanishTimeShort: 'HH:mm',
  dbTime: 'HH:mm:ss',
} as const;

const dateTimeConstants = {
  crpDateTime: 'DDMMYYYYHHmmss',
  crpDateTimeShort: 'DDMMYYHHmm',
  inetumDateTime: 'YYYYMMDDHHmmss',
  spanishDateTime: 'DD-MM-YYYY HH:mm:ss',
  dbDateTime: 'YYYY-MM-DD HH:mm:ss',
} as const;

export const allConstants = {
  ...dateConstants,
  ...timeConstants,
  ...dateTimeConstants,
} as const;
