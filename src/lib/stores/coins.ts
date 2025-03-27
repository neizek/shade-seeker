import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

function getCoins(): number {
	if (!browser) {
		return 0;
	}

	const savedCoins = localStorage.getItem('coins');

	return savedCoins ? JSON.parse(savedCoins) : 0;
}

export function addCoins(amount: number) {
	coins.update(current => {
		const newAmount = current + amount;
		if (browser) localStorage.setItem('coins', JSON.stringify(newAmount));

		return newAmount;
	});

	
}

export function withdrawCoins(amount: number) {
	coins.update(current => {
		const newAmount = current - amount;
		if (browser) localStorage.setItem('coins', JSON.stringify(newAmount));
		
		return newAmount;
	});
}

export const coins: Writable<number> = writable(getCoins());