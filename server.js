var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var compiler = webpack(config);

var keyword = ['猫', '大象', '飞机', '钱', '炸弹', '猪'], KEYWORD;

app.use(express.static(path.join(__dirname, '/')))
    //use in webpack development mode
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

//use in webpack production mode
//app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
    //接收path
    socket.on('drawPath', function(data) {
        socket.broadcast.emit('showPath', data);
    });

    socket.on('submit', function(keyword) {
        var bingo = 0;
        if (KEYWORD.toLocaleLowerCase() == keyword.toLocaleLowerCase()) {
            bingo = 1;
        }
        socket.emit('answer', {
            bingo
        });
    });

    socket.on('message', function(message){
        if(message == 'getKeyWord'){
            KEYWORD = keyword[Math.floor(Math.random() * keyword.length)];
            socket.emit('keyword', KEYWORD);
        }else if(message == 'clear'){
            socket.emit('showBoardClearArea');
        }
    });

    socket.on('disconnect', function() {});
});

server.listen(3000, 'localhost', function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:3000');
});
