import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export type ScoreObjectType = {
	thirdWheel: number;
	shadeOrder: number;
}

function getScores() {
	if (!browser) {
		return {
			thirdWheel: 0,
			shadeOrder: 0
		}
	}

	const savedScores = localStorage.getItem('scores');
	
	if (savedScores) {
		return JSON.parse(savedScores);
	} else {
		return {
			thirdWheel: 0,
			shadeOrder: 0
		}
	}
}

export function updateScore(newScore: number, game: string) {
	let newMaxScore: ScoreObjectType; 

	maxScore.update(current => {
		newMaxScore = {
			...current,
			[game]: newScore
		}

		if (browser) {
			localStorage.setItem('scores', JSON.stringify(newMaxScore))
		}

		return newMaxScore;
	});
}

export const gamesPlayed = writable(0);
export const maxScore: Writable<ScoreObjectType> = writable(getScores());