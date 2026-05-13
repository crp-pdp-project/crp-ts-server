export default `
Hola <%- name %>. Por motivos de seguridad, Clínica Ricardo Palma solicita que confirmes tu identidad antes de continuar.

Utiliza el siguiente código de verificación: <%- otp %>

Este código tiene una validez limitada. No lo compartas con nadie.
`.trim();
