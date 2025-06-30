const pool = require('../dbconexion')

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

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}