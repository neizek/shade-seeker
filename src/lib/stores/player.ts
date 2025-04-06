import { writable } from "svelte/store";
import { addPlayer, getPlayersQty } from "./firebase.js";
import { browser } from "$app/environment";

function generateNewPlayer() {
	getPlayersQty().then(totalPlayers => {
		const nickname = `player-${totalPlayers++}`
		addPlayer(nickname, 0).then(id => {
			playerId.set(id);
			localStorage.setItem('playerId', JSON.stringify(id));
		});
	})
}

function getPlayer(): string | undefined | void {
	if (!browser) {
		return;
	}

	const savedPlayerName = localStorage.getItem('playerId');
	
	return savedPlayerName ? JSON.parse(savedPlayerName) : generateNewPlayer();
}

export const playerId = writable(getPlayer());