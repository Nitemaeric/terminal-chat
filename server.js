var args = process.argv.splice(2);

var port = args[0] ? args[0] : 1992

var Server = require('socket.io');
var io = new Server(port);

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var _ = require('lodash')

Array.prototype.remove = function(item){
	for(var i = this.length; i--;) {
		if(this[i] === item) {
			this.splice(i, 1);
		}
	}
}

var list = [];

console.log('Starting server on port '+port);

chat();

io.on('connection', function(socket){
	socket.on('login', function(username){
		if(_.contains(list, username)){
			socket.emit('incorrect', 'Please choose a different username.');
		}
		else{
			socket.username = username

			list.push(username)

			console.log('User List:')
			console.log(list)

			socket.emit('login', 'Logged in as '+username);
		}
	})

	socket.on('message', function(message){
		if(message[0] == '/'){
			if(message == '/userlist' || message == '/ul'){
				socket.emit('command', list)
			}
		}
		else{
			socket.broadcast.emit('message', socket.username+': '+message)
		}
	})

	socket.on('disconnect', function(){
		list.remove(socket.username)

		console.log('User List:')
		console.log(list)
	})
})

function chat(){
	rl.question("", function(message){
		io.emit('message', 'SERVER: '+message)
		chat();
	})
}