var args = process.argv.splice(2);

var port = args[0] ? args[0] : 1992

var Server = require('socket.io');
var io = new Server(port);

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var utils = require('./lib/serverUtils')

var _ = require('lodash')

Array.prototype.remove = function(item){
	for(var i = this.length; i--;) {
		if(this[i] === item) {
			this.splice(i, 1);
		}
	}
}

String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
};

var list = [];
var adminList = [];
var modList = [];

console.log('Starting server on port '+port);

chat();

io.on('connection', function(socket){
	// LOGIN PROCESS
	socket.on('login', function(username){
		if(utils.contains(list, username)){
			socket.emit('incorrect', 'Please choose a different username.');
		}
		else{
			socket.username = username
			socket.status = 'Guest'

			list.push(username)

			utils.log('User List', utils.formattedUserList())

			socket.emit('login', 'Logged in as '+username);
		}
	})

	// CLIENT MESSAGES
	socket.on('message', function(message){
		if(message.length > 0){
			if(message[0] == '/'){
				if(message == '/userlist' || message == '/ul'){
					socket.emit('command', utils.formattedUserList())
				}
				else if(message.startsWith('/say ')){
					socket.broadcast.emit('speak', socket.username+' says '+message.slice(5))
				}
				else if(message == '/admins'){
					socket.emit('command', utils.formattedAdminList())
				}
				else if(message == '/mods' || message == '/moderators'){
					socket.emit('command', utils.formattedModList())
				}
				else if(message == '/status'){
					socket.emit('command', 'User status: '+socket.status)
				}
				else if((socket.status == 'Admin' || socket.status == 'Moderator') && message.startsWith('/kick ')){
					var user = message.slice(6)
					var s = utils.getSocket(user)
					s.emit('message', 'You have been kicked from the chat server.')
					utils.log('User Kicked', s.username+' has been kicked by '+socket.username+'.')
					s.disconnect();
				}
				else if(socket.status == 'Admin' && message.startsWith('/promote ')){
					var user = message.slice(9)
					utils.newMod(user, socket)
				}
			}
			else{
				socket.broadcast.emit('message', socket.username+': '+message)
			}
		}
	})

	// CLIENT DISCONNECTS
	socket.on('disconnect', function(){
		utils.remove(list, socket.username)
		utils.remove(adminList, socket.username)
		utils.remove(modList, socket.username)

		utils.log('User List', utils.formattedUserList())
	})
})

function chat(){
	rl.question("", function(message){
		if(message.startsWith('/admin ')){
			var user = message.slice(7)
			utils.newAdmin(user)
		}
		else if(message =='/ul'){
			utils.log('User List', utils.formattedUserList())
		}
		else if(message =='/admins'){
			utils.log('Admins', utils.formattedAdminList(true))
		}
		else if(message =='/mods'){
			utils.log('Moderators', utils.formattedModList(true))
		}
		else{
			io.emit('message', 'SERVER: '+message)
		}
		chat();
	})
}

// EXPORTS FOR UTILS
exports.list = list;
exports.adminList = adminList;
exports.modList = modList;

exports.io = io;