const { client } = require('./index')

async function createComments(userId, postsId, description){
    try{
        const {rows: [comments],
        } = await client.query(`
            INSERT INTO comments("userId", "postsId", description)
            VALUES($1, $2, $3)
            ON CONFLICT ("userId", "postsId") DO NOTHING
            RETURNING *;
        `,[userId, postsId, description]
        );
        return comments;
    } catch (error){
        throw error
    }
}

async function createPostComment(){
    
}

async function addCommentsToPost(postId, comments) {
    try {
        const createPostCommentPromises = comments.map((comment) => 
            createPostComment(postId, comment.id)
        );
        await Promise.all(createPostCommentPromises);
        return await getPostById(postId);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createComments,
    addCommentsToPost
};