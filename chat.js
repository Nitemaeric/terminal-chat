var args = process.argv.splice(2);

var host = args[0] ? args[0] : 'localhost'
var port = args[1] ? args[1] : 1992

var socket = require('socket.io-client')('http://'+host+':'+port);

var readline = require('readline');

var fs = require('fs')
var spawn = require('child_process').spawn.

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

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
		spawn('say', ['new message'])
		console.log('\u0007'+message);
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

function login(){
	rl.question("Username: ", function(username) {
		socket.emit('login', username);
	})
}

function chat(){
	rl.question("", function(message){
		if(message == '/dir'){
			console.log(fs.readdirSync('.'))
		}
		else{
			socket.emit('message', message)
		}
		chat();
	})
}