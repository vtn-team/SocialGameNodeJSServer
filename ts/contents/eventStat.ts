import { getEvent } from "./../lib/masterDataCache"

export function isEventQuest(questId: number)
{
	//ほんとはもっといい判定が作れると思う
	return questId > 100;
}

export function checkEventIsOpen(eventId: number)
{
	const event = getEvent(eventId);
	const time = (new Date());
	const start = new Date(event.StartAt);
	const end = new Date(event.EndAt);
	const gameEnd = new Date(event.GameEndAt);
	
	return {
		isOpen:  (time >= start && time <= end),
		isGameOpen: (time >= start && time <= gameEnd)
	};
}
