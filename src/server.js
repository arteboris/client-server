const zmq = require('zeromq');
const config = require('./config');
const models = require('./models');

const pubSocket = zmq.socket("pub");
const subSocket = zmq.socket("sub");


pubSocket.bindSync(`tcp://127.0.0.1:${config.pubPort}`);
subSocket.bindSync(`tcp://127.0.0.1:${config.subPort}`);

models.db;
subSocket.subscribe('api_in');

subSocket.on("message", async (topic, data) => {
    const user = JSON.parse(data.toString());
    const { type, email, pwd, msg_id} = user;
    if( type === 'login') {
        const sqlite = `select user_id from users where email="${email}" and passw="${pwd}";`
        
        await models.db.get(sqlite, (err, row) => {
            if(err) throw err;
            if(row){
                const user_id = row.user_id;
                const outMessageSendOk = {
                    msg_id,
                    user_id,
                    status: 'ok',
                };
            pubSocket.send(["api_out", JSON.stringify(outMessageSendOk)]);
            }
            else if(!row){
                const outMessageSendError = {
                    msg_id,
                    status: 'error',
                    error: 'WRONG_PWD',
                };
            pubSocket.send(["api_out", JSON.stringify(outMessageSendError)]);
            }
        });
    } else {
        const outMessageSendWrongFormat = {
            msg_id: msg_id,
            status: 'error',
            error: 'WRONG_FORMAT',
        };
        pubSocket.send(["api_out", JSON.stringify(outMessageSendWrongFormat)]);
    };
});








