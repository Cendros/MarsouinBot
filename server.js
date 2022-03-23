const express = require('express');
const path = require('path');

const server = express();
server.use(express.static(__dirname));
server.use(express.json());

server.all('/', (req, res)=>{
    res.send('Your bot is alive!')
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;