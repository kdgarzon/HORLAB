const pool = require('../dbconexion')

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

module.exports = {
    getUserLogin
}