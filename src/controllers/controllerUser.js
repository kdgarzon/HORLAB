const pool = require('../dbconexion')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const getAllUsers = async (req, res, next) => {
    try {      
        const allUsers = await pool.query(
            "SELECT u.id_usuario, u.nombreUser AS nombre, u.apellidoUser AS apellido, u.correo, u.usuario, u.pass, r.rol AS nombre_rol FROM usuarios u LEFT JOIN rol r ON u.id_rol = r.id_rol ORDER BY id_usuario ASC"
        )
        res.json(allUsers.rows)
    } catch (error) {
        next(error)
    }
}

const getAllRoles = async (req, res, next) => {
    try {
        const allRoles = await pool.query("SELECT * FROM rol")
        res.json(allRoles.rows)
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Usuario no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        next(error)
    }
}

const getUserLogin = async (req, res, next) => {
    try {
        const {usuario, pass} = req.body;
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = $1 AND pass = $2", 
            [usuario, pass]
        );
    
        if(result.rows.length === 0){
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas"
            });
        }
        const user = result.rows[0];
        res.json({
            usuario: user.usuario,
            id_rol: user.id_rol,
            nombre: user.nombreuser,
            apellido: user.apellidouser,
            correo: user.correo
        });
    } catch (error) {
        next(error)
    }
}

const createUser = async (req, res, next) => {
    const {nombreUser, apellidoUser, correo, usuario, pass, id_rol} = req.body
    try {
        const result = await pool.query("INSERT INTO usuarios (nombreUser, apellidoUser, correo, usuario, pass, id_rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
        [
            nombreUser,
            apellidoUser,
            correo,
            usuario, 
            pass,
            id_rol
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        // Error por restricción única (usuario o correo ya existen)
        if (error.code === '23505') {
            let campoDuplicado = 'usuario o correo';

            if (error.constraint === 'usuarios_usuario_key') {
                campoDuplicado = 'usuario';
            } else if (error.constraint === 'unique_correo') {
                campoDuplicado = 'correo';
            }

            return res.status(400).json({ message: `El ${campoDuplicado} ya está en uso.` });
        }

        next(error); // Otros errores
    }
}

const deleteUser = async (req, res, next) => {
    const {idusuarioEliminar} = req.params
    try {
        const result = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1", [idusuarioEliminar])
    
        if(result.rowCount === 0) return res.status(400).json({
            message: "Usuario no se ha podido eliminar"
        });
        
        return res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    const {idusuarioActualizar} = req.params;
    try {
        const {nombreUser, apellidoUser, correo, usuario, pass, id_rol} = req.body;
    
        const result = await pool.query("UPDATE usuarios SET nombreuser = $1, apellidouser = $2, correo = $3, usuario = $4, pass = $5, id_rol = $6 WHERE id_usuario = $7 RETURNING *", 
            [nombreUser, apellidoUser, correo, usuario, pass, id_rol, idusuarioActualizar]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar el usuario seleccionado"
        });
        return res.json(result.rows[0])
    } catch (error) {
        if (error.code === '23505') {
            // Error por restricción UNIQUE (ya existe el usuario)
            return res.status(400).json({
                message: 'Ya existe un usuario con ese nombre de usuario o correo electrónico.'
            });
        }
        next(error);
    }
}

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
    getAllUsers,
    getAllRoles,
    getUser,
    getUserLogin,
    createUser,
    deleteUser,
    updateUser,
    sendResetPasswordEmail,
    resetPassword
}