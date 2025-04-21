const pool = require('../dbconexion')

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await pool.query(
            "SELECT u.id_usuario, u.usuario, u.pass, r.rol AS nombre_rol FROM usuarios u LEFT JOIN rol r ON u.id_rol = r.id_rol ORDER BY id_usuario ASC"
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

const createUser = async (req, res, next) => {
    const {usuario, pass, id_rol} = req.body
    try {
        const result = await pool.query("INSERT INTO usuarios (usuario, pass, id_rol) VALUES ($1, $2, $3) RETURNING *", 
        [
            usuario, 
            pass,
            id_rol
        ]);
    
        res.json(result.rows[0])
    } catch (error) {
        next(error)
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
        const {usuario, pass, id_rol} = req.body;
    
        const result = await pool.query("UPDATE usuarios SET usuario = $1, pass = $2, id_rol = $3 WHERE id_usuario = $4 RETURNING *", 
            [usuario, pass, id_rol, idusuarioActualizar]);

        if(result.rows.length === 0) return res.status(404).json({
            message: "No es posible modificar el usuario seleccionado"
        });
        return res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers,
    getAllRoles,
    getUser,
    createUser,
    deleteUser,
    updateUser
}