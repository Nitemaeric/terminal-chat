var args = process.argv.splice(2);

var host = args[0] ? args[0] : 'localhost'
var port = args[1] ? args[1] : 1992

var socket = require('socket.io-client')('http://'+host+':'+port);

var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question("Username: ", function(username) {
	socket.emit('login', username);

	socket.on('login', function(username){
		console.log('Logged in as '+username);
		chat();
	})

	socket.on('message', function(message){
		console.log(message);
		chat();
	})

	socket.on('command', function(result){
		console.log(result);
	})

	socket.on('disconnect', function(){
		console.log('disconnected.');
		process.exit(0);
	})
});

function chat(){
	rl.question("", function(message){
		socket.emit('message', message)
		chat();
	})
}