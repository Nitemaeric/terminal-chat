var server = require('../server')

var _ = require('lodash')

Array.prototype.remove = function(item){
	for(var i = this.length; i--;) {
		if(this[i] === item) {
			this.splice(i, 1);
		}
	}
}

function getId(username){
	var id;
	_.each(server.io.sockets.connected, function(socket){
		if(socket.username == username){
			id = socket.id
		}
	})
	return id;
}

function sendBack(channel, message, socket){
	socket.emit(channel, message);
}

function getSocket(username){
	var s;
	_.each(server.io.sockets.connected, function(socket){
		if(socket.username == username){
			s = socket
		}
	})
	return s;
}

function formattedUser(socket){
	return socket.username+'('+socket.id+')'
}

function log(title, message){
	console.log('--- '+title+' ---');
	console.log(message);
}

function formattedList(list, includeId, includeStatus){
	var users = [];
	_.each(list, function(user){
		users.push(includeId ? formattedUser(user) : user.username)
	})
	return users
}

function formattedUserList(){
	var users = [];
	_.each(server.io.sockets.connected, function(socket){
		users.push(socket.username+shortStatus(socket))
	})
	return users
}

function shortStatus(socket){
	var val = '';
	if(socket.status == 'Admin'){
		val = '(A)';
	}
	else if(socket.status == 'Moderator'){
		val = '(M)';
	}
	return val
}

function changeStatus(username, status, origin){
	var list = [];
	if(status == 'Admin'){
		list = server.adminList
	}
	else if(status == 'Moderator'){
		list = server.modList
	}

	_.each(server.io.sockets.connected, function(socket){
		if(socket.username == username){
			var obj = {
				id: getId(username),
				username: username
			}

			if(contains(server.adminList, username)){
				if(status == 'Moderator'){
					origin.emit('command', 'This user is an Admin.')
					return null;
				}
			}
			else if(contains(server.modList, username)){
				if(status == 'Moderator'){
					origin.emit('command', 'This user is already a Moderator.')
					return null;
				}
				else if(status == 'Admin'){
					remove(server.modList, username)
				}
			}

			if(!_.contains(list, obj)){
				list.push(obj)
			}

			socket.status = status
			socket.emit('message', 'You have been promoted to '+status+' status')
			log('New '+status, 'Added '+formattedUser(socket)+' to '+status+' List')
		}
	})
}

function contains(list, username){
	var result = false
	_.each(list, function(user){
		if(user.username == username){
			result = true
		}
	})
	return result
}

function remove(list, username){
	var i = -1;
	_.each(list, function(user, index){
		if(user.username == username){
			i = index;
		}
	})
	if(i != -1){
		list.splice(i, 1)
	}
}

module.exports = {
	getId: getId,
	getSocket: getSocket,

	newAdmin: function (username){
		changeStatus(username, 'Admin')
	},

	newMod: function(username, origin){
		changeStatus(username, 'Moderator', origin)
	},

	formattedAdminList: function(includeId){
		return formattedList(server.adminList, includeId);
	},

	formattedModList: function(includeId){
		return formattedList(server.modList, includeId);
	},

	formattedUserList: formattedUserList,

	formattedUser: formattedUser,

	sendBack: sendBack,

	log: log,
	contains: contains,
	remove: remove
}