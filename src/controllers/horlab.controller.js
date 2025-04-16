const pool = require('../dbconexion')

const getAllUsers = async (req, res) => {
    res.send('Retrieven a list of users')
}

const getUser = async (req, res) => {
    res.send('Retornando el dato solicitado de usuario');
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