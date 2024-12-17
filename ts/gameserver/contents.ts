
export enum TARGET {
	ALL = 0,
	SELF = 1,
	OTHER = 2,	//TargetSessionIdsが渡される
};

export enum CMD {
	WELCOME = 1,
	JOIN = 2,
	EVENT = 3,
	SEND_JOIN = 100,
	SEND_EVENT = 101,
};

export function createMessage(senderId: string, command: CMD, target:TARGET, data: any) {
	//let msg = msgpack.pack(data);
	delete data["Command"]
	let msg = JSON.stringify(data);
	let ret = { 
		"UserId" : senderId,
		"Target" : target,
		"Command" : command,
		"Data" :msg
	};
	return ret;
}


class GameContainer {
	protected gameId: number;
	protected queue: Array<any>;
	
	constructor(gameId: number) {
		this.gameId = gameId;
		this.queue = [];
	}
}

export class VantanConnect {
	games: any;
	sessionDic: any;
	broadcast: any;
	
	constructor(bc: any) {
		this.games = {};
		this.sessionDic = {};
		this.broadcast = bc;
	}

	public execMessage(data: any) {
		switch(data["Command"])
		{
		case CMD.SEND_JOIN:
			this.joinRoom(data);
			break;
		
		case CMD.SEND_EVENT:
		{
			let userId = data["UserID"];
			createMessage(userId, CMD.EVENT, TARGET.ALL, data);
		}
		break;
		}
	}

	joinRoom(data: any) {
		if(this.games[data.GameId]) {
			
		}
		
		if(data.GameId === 0) {
			console.log(`GAME ID:0 reject.`);
			return ;
		}
		
		this.games[data.GameId] = new GameContainer(data.GameId);
		this.sessionDic[data.SessionId] = data.GameId;
		console.log(`GAME ID:${data.GameId} join.`);
	}
	
	public removeSession(sessionId: string) {
		if(!this.sessionDic[sessionId]) {
			return;
		}
		
		let gameId = this.sessionDic[sessionId];
		delete this.games[gameId];
		delete this.sessionDic[sessionId];
		
		console.log(`GAME ID:${gameId} leave.`);
	}
	
	public getActiveGames() {
		let games:any = [];
		
		for(var gId in this.games) {
			let us = this.games[gId];
		}
		
		return games;
	}
};
