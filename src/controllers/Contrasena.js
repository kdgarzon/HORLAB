const pool = require('../dbconexion')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const sendResetPasswordEmail = async (req, res, next) => {
  const { correo } = req.body;
  try {
    const userResult = await pool.query("SELECT id_usuario FROM usuarios WHERE correo = $1", [correo]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    const id_usuario = userResult.rows[0].id_usuario;
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(`
        INSERT INTO Recuperar_pass (id_usuario, reset_token, expiration)
        VALUES ($1, $2, $3)
    `, [id_usuario, token, expiration]);

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log("Enlace de restablecimiento:", resetLink);
    
    //ENVIAR CORREO CON NODEMAILER
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kdgarzong@gmail.com',
          pass: 'hpzj zieq bvyd tgwi'
        }
    });
      
    await transporter.sendMail({
        from: 'kdgarzong@gmail.com',
        to: correo,
        subject: 'Recuperación de contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
    });

    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
    const {newPassword} = req.body
    const { token } = req.params;
  
    try {
      const result = await pool.query(
        "SELECT * FROM Recuperar_pass WHERE reset_token = $1 AND expiration > NOW() AND used = FALSE",
        [token]
      );
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Token inválido o expirado" });
      }

      const { id_usuario } = result.rows[0];
  
      await pool.query(
        "UPDATE usuarios SET pass = $1 WHERE id_usuario = $2",
        [newPassword, id_usuario]
      );

      await pool.query(`
        UPDATE Recuperar_pass SET used = TRUE WHERE reset_token = $1
      `, [token]);
  
      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      next(error);
    }
};

module.exports = {
    sendResetPasswordEmail,
    resetPassword
};