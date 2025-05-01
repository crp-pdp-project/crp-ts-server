export default `
<body>
  <div>
    <h2>Hola <%- name %>,</h2>
    <p>Esta es la OTP para la recuperación de contraseña, recuerda que tienes 5 minutos para usarla.</p>
    <p>Código: <b><%- otp %></b></p>
  </div>
</body>
`.trim();
