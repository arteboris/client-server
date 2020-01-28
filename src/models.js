const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const filePath = path.join(__dirname, './', 'db/', 'users.db');

const db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE, err => {
    if (err) throw err;

    console.log('Connected to User DB')
})

                            ///*** SCHEMA users ***///
// db.serialize(() => {
//     db.run(
//         'CREATE TABLE IF NOT EXISTS users (user_id INTEGER NOT NULL PRIMARY KEY, email TEXT NOT NULL UNIQUE, passw TEXT NOT NULL UNIQUE);', function (err) {
//             if (err) throw err;

//             console.log('Table created')
//         });
// });

async function getUserId(email, pwd) {
    const checkParams = `SELECT * FROM users WHERE email = ${email} AND passw = ${pwd};`;
    return await  db.get(checkParams, (err, row) => {
        if (err) return err;
        return row;
    });
};

module.exports = {
    db,
    getUserId,
};