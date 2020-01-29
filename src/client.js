const zmq = require('zeromq');
const config = require('./config');
const randomstring =require('randomstring');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pubSocket = zmq.socket("pub");
const subSocket = zmq.socket("sub");


pubSocket.connect(`tcp://127.0.0.1:${config.subPort}`);
subSocket.connect(`tcp://127.0.0.1:${config.pubPort}`);

subSocket.subscribe('api_out');

subSocket.on("message", (topic, data) => {
    const message = JSON.parse(data.toString());
    const { status } = message;
    if( status === 'ok') console.log('ok');
    if( status === 'error') console.log('error');
});


const user = {
    type: 'login',
    msg_id: randomstring.generate(10),
};

rl.question('Please enter your email...', email => {
    user.email = email;
    rl.question('Please enter your password...', pwd => {
        user.pwd = pwd;
        pubSocket.send(["api_in", JSON.stringify(user)]);
    });
});