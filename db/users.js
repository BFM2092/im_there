const { client } = require('./index');

async function createUser({email, password}) {
    try {
        const response = await client.query(`
            INSERT INTO users(email, password)
            VALUES($1, $2)
            ON CONFLICT DO NOTHING RETURNING *;
        `, [email, password]
        );
        return response.rows;
    } catch (error){
        throw error;
    }
}

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM users;
        `);
        return rows;
    } catch (error) {
        throw error
    }
}


module.exports = {
    createUser,
    getAllUsers
};