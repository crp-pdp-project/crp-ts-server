export const FirebaseConstants = {
  DEFAULT_SCOPES: ['https://www.googleapis.com/auth/firebase.messaging'],
  BASE_PATH: '/v1/projects/',
  OPERATION: '/messages:send',
  TOKEN_TIMEOUT: 45,
} as const;
