# React Chat

### Motivation
This project was dedicated to working with WebSockets and ReactJS/Redux in tandem. What better than a chat app to do so? 
Keep in mind, this was a weekend project, there are still a lot of improvements that can be done to this app.

### Live Demo
You can see a live demo of the app [here](http://chat.lgse.net). Use server `chat.lgse.net:1337` and encryption `SSL/TLS`

### Requirements
* Node.JS ^4.0.0
* NPM ^3.0.0
* Redis

### Installation
    git clone https://github.com/lgse/react-chat.git
    npm install
    npm run build:dist
    
### Before Starting
By default, the chat server will run on port `1337` and connects to the Redis service via port `6379`.
Ensure that the appropriate firewall rules are in place for clients to be able to connect.

The WebSockets are using the unsecured ws:// protocol by default  but can be configured to use SSL/TLS. 
The server configuration file is located in `/bin/chat-server/config.json`

Refer to the [Primus library documentation](https://github.com/primus/primus#getting-started) for more info

A sample configuration for SSL would be:
    
    {
      "redis": {
        "channel": "react-chat",
        "host": "127.0.0.1",
        "port": 6379
      },
      "primus": {
        "port": 1337,
        "root": "/folder/with/https/cert/files",
        "cert": "myfilename.cert",
        "key": "myfilename.cert",
        "ca": "myfilename.ca",
        "pfx": "filename.pfx",
        "passphrase": "my super sweet password",
        "transformer": "websockets"
      },
      "webServer": {
        "port": 80
      }
    }
    
### How to start the Chat Server / WebServer
This will start both the chat server and webserver
    
    npm run chat-server
    
You can also run the chat server standalone if you choose to host the static content using a different web server
    
    npm run chat-server:standalone
    

    