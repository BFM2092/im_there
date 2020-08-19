const { client } = require('./index')

const { createComments } = require("./comments");

async function createPost({ userId, title, location, date, time, description, comments =[]}) {
    try{
        const { rows: [post] } = await client.query(`
            INSERT INTO posts("userId", title, location, date, time, description)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [userId, title, location, date, time, description]
        ), 
        const comments = await createComments(comments);
        return await addCommentsToPost(post.id, comments)
        
    } catch (error){
        throw error;
    }
}

async function getPostById(){
    
}

module.exports = {
    createPost
}