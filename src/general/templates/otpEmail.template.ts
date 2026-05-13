export default `
<body>
  <div>
    <h2>Hola <%- name %>,</h2>
    <p>Por motivos de seguridad, Clínica Ricardo Palma solicita que confirmes tu identidad antes de continuar.</p>
    <p>Utiliza el siguiente código de verificación:</p>
    <p style="font-size: 18px;"><b><%- otp %></b></p>
    <p>Este código tiene una validez limitada. No lo compartas con nadie.</p>
  </div>
</body>
`.trim();
