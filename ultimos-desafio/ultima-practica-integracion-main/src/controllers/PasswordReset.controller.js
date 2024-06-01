
import { PasswordDao, UserDao } from '../daos/factory.js';
import { createHash } from '../utils/hashBcrypt.js';
import { sendMail } from '../utils/sendEmail.js';

export class PasswordResetController {
  constructor (){
    this.passResetService = new PasswordDao();
    this.userService= new UserDao()
  }
// FUNCION PARA SOLICITAR RESTABLECIMIENTO CONTRASEÑA 
requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log("Email del usuario:", email); 

  try {
  // Generar el token para restablecer la contraseña
    const token = await this.passResetService.generatePasswordResetToken(email);
   console.log("El token generado para restablecer la contraseña:", token);

  // Construir la URL para el restablecimiento de contraseña
    const resetPasswordUrl = `http://localhost:8083/updatePassword?token=${token}`;

  // Crear el mensaje HTML para el correo electrónico
    const html = `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                  <a href="${resetPasswordUrl}">Restablecer contraseña</a>`;

  // Enviar un correo electrónico con el enlace de restablecimiento de contraseña
    await sendMail(email, 'Restablecimiento de contraseña', html);

  // Configurar la cookie con el token y enviarla al cliente
    res.cookie('cookieToken', token, { httpOnly: true });

  // Enviar respuesta al cliente
    res.status(200).send('Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada.');
  } catch (error) {
console.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).send('Error al solicitar restablecimiento de contraseña');
  }
}

// FUNCION PARA RESTABLECER CONTRASEÑA
updatePassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
 console.log("el token desde controler", token);


  // Validar que las contraseñas coincidan
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  try {
    const hashedPassword = createHash(newPassword);

    // Verificar si el token es válido y obtener el email asociado
    const email = await this.passResetService.getEmailFromToken(token);
    console.log(`Email obtenido del token: ${email}`);

    if (email) {
      // actualizar la contraseña utilizando el email
      await this.userService.updatePasswordByEmail(email, hashedPassword)
   
      const message = 'Contraseña actualizada correctamente. Haz clic <a href="/login">aquí</a> para volver al login.';
  
      res.status(200).send(message);
    }
  } catch (error) {
   console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
}
}
