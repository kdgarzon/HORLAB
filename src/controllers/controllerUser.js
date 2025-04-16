const pool = require('../dbconexion')

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM Usuarios")
        res.json(allUsers.rows)
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const getUser = async (req, res) => {
    try {
        const {id} = req.params
        const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id])
    
        if(result.rows.length === 0) return res.status(404).json({
            message: "Usuario no encontrado en la base de datos"
        });
        res.json(result.rows[0]);
    } catch (error) {
        res.json({error: error.menssage});
    }
}

const createUser = async (req, res) => {
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
        res.json({error: error.menssage});
    }
}

const deleteUser = async (req, res) => {
    const {idusuarioEliminar} = req.params
    const result = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1", [idusuarioEliminar])
    
    if(result.rowCount === 0) return res.status(400).json({
        message: "Usuario no se ha podido eliminar"
    });
    
    return res.sendStatus(204);
}

const updateUser = async (req, res) => {
    const {idusuarioActualizar} = req.params;
    const {usuario, pass, id_rol} = req.body;
    
    const result = await pool.query("UPDATE usuarios SET usuario = $1, pass = $2, id_rol = $3 WHERE id_usuario = $4 RETURNING *", 
        [usuario, pass, id_rol, idusuarioActualizar]);

    if(result.rows.length === 0) return res.status(404).json({
        message: "No es posible modificar el usuario seleccionado"
    });
    return res.json(result.rows[0])
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}