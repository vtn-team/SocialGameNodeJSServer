
export enum TARGET {
	ALL = 0,
	SELF = 1,
	OTHER = 2
};

export enum CMD {
	WELCOME = 1,
	JOIN = 100,
	EVENT = 101,
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


class GameUser {
	protected queue: Array<any>;
}


export class VantanConnect {

	users: Array<GameUser>;
	broadcast: any;
	
	
	constructor(bc: any) {
		this.users = [];
		this.broadcast = bc;
	}

	public execMessage(data: any) {
		switch(data["Command"])
		{
		case CMD.JOIN:
			this.joinRoom(data);
			break;
		
		case CMD.EVENT:
		{
			let userId = data["UserID"];
			createMessage(userId, CMD.EVENT, TARGET.ALL, data);
		}
		break;
		}
	}

	joinRoom(data: any) {
		this.users.push(data);
		
		let userId = data["UserID"];
		createMessage(userId, CMD.JOIN, TARGET.ALL, []);
	}
};

