import { browser } from "$app/environment";
import { writable } from "svelte/store";

function getScore() {
	return browser ? Number(localStorage.getItem('score')) : 0;
}

export function updateScore(newScore: number) {
	maxScore.set(newScore);
	if (browser) {
		localStorage.setItem('score', newScore.toString());
	}
}

export const maxScore = writable(getScore());