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

                // **** sqlite> select*from users; ****////
// user_id  email            passw
// -------  ---------------  -------
// 1        artem@gmail.com  qwerty
// 2        test@gmail.com   12345
// 3        borys@gmail.com  123456

//           console.log('Table created')
//         });
// });

module.exports = {
    db,
};