var args = process.argv.splice(2);

var host = args[0] ? args[0] : 'localhost'
var port = args[1] ? args[1] : 1992

var socket = require('socket.io-client')('http://'+host+':'+port);

var readline = require('readline');

var fs = require('fs')
var spawn = require('child_process').spawn

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

var savePath = process.cwd();

rl.question("Username: ", function(username) {
	socket.emit('login', username);

	socket.on('login', function(reply){
		console.log(reply);
		chat();
	})

	socket.on('incorrect', function(reply){
		console.log(reply);
		login();
	})

	socket.on('message', function(message){
		rl.pause()
		console.log('\u0007'+message);
		rl.prompt(true)
	})

	socket.on('speak', function(message){
		rl.pause()
		spawn('say', [message])
		console.log(message);
		rl.prompt(true)
	})

	socket.on('command', function(result){
		rl.pause()
		console.log(result);
		rl.prompt(true)
	})

	socket.on('disconnect', function(){
		console.log('disconnected.');
		process.exit(0);
	})
});

function login(){
	rl.question("Username: ", function(username) {
		socket.emit('login', username);
	})
}

function chat(){
	rl.question("", function(message){
		if(message.length > 0){
			if(message == '/dir'){
				console.log(fs.readdirSync('.'))
			}
			else if(message == '/sp' || message == '/savepath'){
				console.log(savePath);
			}
			else{
				socket.emit('message', message)
			}
		}
		chat();
	})
}