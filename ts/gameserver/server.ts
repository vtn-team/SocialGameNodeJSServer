import { VantanConnect, CMD, TARGET, createMessage } from "./contents"
import { WebSocket, WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

let gServer:Server|null = null;

class UserSession {
	protected userId: string;
	protected client: WebSocket;
	protected isPingAlive: boolean;
	
	constructor(userId: string, ws: WebSocket) {
		this.userId = userId;
		this.client = ws;
		this.isPingAlive = true;
	}
	
	public term() {
		this.client.terminate();
	}
	
	public sendMessage(msg: string) {
		if (this.client == null) return 
		if (this.client.readyState != WebSocket.OPEN) return;
		
		this.client.send(msg);
	}
	
	public isAlive() : boolean {
		return this.client.readyState == WebSocket.OPEN;
	}
	
	public ping() {
		this.client.ping();
		this.isPingAlive = false;
	}
	public pong() {
		this.isPingAlive = true;
	}
	
	public chkTarget(tgt: TARGET, tgtId: string) {
		switch(tgt) {
		case TARGET.ALL:return true;
		case TARGET.SELF: return (this.userId == tgtId);
		case TARGET.OTHER: return (this.userId != tgtId);
		}
	}
};


class Server {
	
	protected sessions: Array<UserSession>;
	protected server: any;
	protected roomCheck: any;
	protected contents: VantanConnect;

	broadcast(data: any) {
		let msg = JSON.stringify(data);
		//let msg = msgpack.pack(data);
		this.sessions.forEach((cli) => {
			if(!cli.chkTarget(data.Target, data.UserId)) return;
			cli.sendMessage(msg);
			console.log("send:" + msg);
		});
	};
	
	
	constructor(port: number) {
		this.sessions = [];
		this.server = new WebSocketServer({ port });
		this.contents = new VantanConnect((data: any)=>{ this.broadcast(data); });
		this.server.on ('connection', (ws: any) => {
			let uuid = randomUUID();
			let session = new UserSession(uuid, ws);
			this.sessions.push(session);
			
			ws.on('pong', () => {
				session.pong();
			});
			
			ws.on('message', (message: string) => {
				console.log(' Received: %s', message);
				try
				{
					let data = JSON.parse(message);
					this.contents.execMessage(data);
				}
				catch(ex)
				{
					console.log(ex);
				}
			});

			//Joinをもらうためのエコーバック
			let echoback = createMessage("None", CMD.WELCOME, TARGET.SELF, "None");
			let payload = JSON.stringify(echoback);
			ws.send(payload);
		});
		
		this.server.on('close', () => {
			clearInterval(this.roomCheck);
		});
		
		this.roomCheck = setInterval(() => {
			this.server.clients.forEach((us:UserSession) => {
				if (!us.isAlive()) return us.term();
				
				us.ping();
			});
		}, 30000);
		
		console.log("server launch port on :" + port);
	}
}

export function launchDGS(port: number) {
	if(gServer != null) return;
	
	gServer = new Server(port);
}