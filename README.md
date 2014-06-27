# terminal-chat

A simple chat client/server for Unix Terminal.

## Requirements

- [Node.js](http://nodejs.org)
- A Unix Terminal

## Installation

- Clone the repo:

```
git clone git@github.com:Nitemaeric/terminal-chat.git
```

- Install the dependencies:

```
npm install
```

- Run the server:

```
node server.js [port]
```
<p style="margin-left: 1em">port is optional. Default port is :1992</p>

- Run clients:

```
node chat.js [host, [port]]
```
<p style="margin-left: 1em">host and port are optional, host is necessary if you choose to specify a port number.</p>
<p style="margin-left: 1em">host defaults to 'localhost' and port to :1992.</p>

## Usage

When you start the client, you will receive a prompt to enter a Username. This will be your display name for the session.

Type in any text and press `Enter`/`Return` to send the message to other clients connected to the server.

- Commands
	- /ul or /userlist
		- Displays the Usernames of all connected clients.
	- /say
		- Reads out your message to recipients by using Mac OS's `say` command.
		
## Future Plans

- Admin / Moderator status to kick users.
- File transfer/streaming.

## Node Packages

- [Socket.io](http://socket.io/)

### Feel free to request features and create pull requests.