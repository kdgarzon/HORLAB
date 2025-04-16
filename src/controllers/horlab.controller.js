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
    res.send('Eliminando usuario');
}

const updateUser = async (req, res) => {
    res.send('Actualizando usuario');
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}