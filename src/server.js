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
    const frame = JSON.parse(data.toString());
    const { type, email, pwd, msg_id} = frame;
    if( type === 'login') {
        const userId = await models.getUserId( email, pwd );
        if(userId){
            const outMessageSend = {
                msg_id: msg_id,
                user_id: userId,
                status: 'ok',
            };
            pubSocket.send(["api_out", JSON.stringify(outMessageSend)]);
        } else {
            const outMessageSendError = {
                msg_id: msg_id,
                status: 'error',
                error: 'WRONG_PWD',
            };
            pubSocket.send(["api_out", JSON.stringify(outMessageSendError)]);
        };
    } else {
        const outMessageSendWrongFormat = {
            msg_id: msg_id,
            status: 'error',
            error: 'WRONG_FORMAT',
        };
        pubSocket.send(["api_out", JSON.stringify(outMessageSendWrongFormat)]);
    };
});








