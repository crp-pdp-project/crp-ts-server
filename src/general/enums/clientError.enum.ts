export enum ClientErrorMessages {
  DEFAULT = '¡Oops! Parece que ocurrió un error, volveremos pronto',
  WRONG_OTP = 'El código ingresado no es válido. Prueba otra vez o solicita uno nuevo',
  PATIENT_NOT_FOUND = 'No tienes una historia clínica registrada',
  UNPROCESSABLE_PATIENT = 'No tienes correo ni celular registrado. Contáctate con la clínica para actualizar los datos de contacto',
  PATIENT_REGISTERED = 'Ya tienes una cuenta registrada. Puedes iniciar sesión',
  PATIENT_NOT_REGISTERED = 'No tienes una cuenta registrada. Registra una cuenta ingresando tus datos',
  INCONSISTENT_PATIENT = 'Hubo un problema registrando tu cuenta. Contáctate con la clínica para revisar tus datos',
  JWE_TOKEN_INVALID = 'No pudimos validar tu sesión. Prueba otra vez o inicia sesión nuevamente',
  SIGN_IN_INVALID = 'Los datos ingresados no son correctos. Prueba otra vez',
}
