const { client } = require("./index");

const { createUser, getAllUsers } = require("./users");

const { createPost } = require("./posts");



async function createTables() {
  try {
    const response = await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "userId" INTERGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                date VARCHAR(255) NOT NULL,
                time VARCHAR(255) NOT NULL,
                description TEXT NOT NULL
            );
            CREATE TABLE comments(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id) NOT NULL,
                "postsId" INTEGER REFERENCES posts(id) NOT NULL,
                description TEXT,
                UNIQUE ("userId", "postsId")
            );
            CREATE TABLE post_comments(
                "postsId" INTEGER REFERENCES posts(id),
                "commentsId" INTEGER REFERENCES comments(id),
                UNIQUE ("postId", "commentId")
            );
        `);
  } catch (error) {
    throw error;
  }
}

async function dropTables() {
  try {
    await client.query(`
            DROP TABLE IF EXISTS comments;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
  } catch (error) {
    throw error;
  }
}

async function createInitialUser() {
  try {
    const fonsi = await createUser({
      name: "fonsi",
      email: "fonsi@gmail.com",
      password: "12345",
    });
  } catch (error) {
    throw error;
  }
}

async function createInitialPost() {
  try {
    const [fonsi] = await getAllUsers();

    await createPost({
      userId: 1,
      title: "denver trip",
      location: "Denver, Colorado",
      date: "09/03/2020",
      time: "1:00PM",
      description: "A fun getaway trip with the fam!",
      comments: ["Nice! I'll be there!"],
    });
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    const { rows } = await client.query(`
            SELECT * FROM users;
        `);
    console.log(rows);
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUser();
    await createInitialPost();
  } catch (error) {
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
