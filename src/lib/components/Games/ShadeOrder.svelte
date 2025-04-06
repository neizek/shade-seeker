<script lang="ts">
	import { generateRandomHexColor, getDarkerColor } from "$lib/utils/colors.js";
	import { fade, scale } from "svelte/transition";
	import PopUp from "../LostGame.svelte";
	import { gamesPlayed, maxScore, updateScore } from "$lib/stores/score.js";
	import Timer from "../Timer.svelte";
	import { showInterstitialAds } from "$lib/stores/admob.js";
	import { Modes } from "$lib/stores/modes.js";
	import { addCoins, withdrawCoins } from "$lib/stores/coins.js";

	type CubeType = {
		color: string;
		order: number;
		chosenOrder?: number;
	}

	export let isGameOn: boolean;

	let cubesQuantity: number = 3;
	let cubes: CubeType[] = generateCubes();
	let counter: number = 0;
	let score: number = 0;
	let lostGame: string | undefined = undefined;
	// let gameOverText: string = 'Game Over';
	let timer: number = 10000;
	let elapsed: number;
	let timerStopped: boolean = false;
	let coins: number = 0;

	function shuffleArray(array: object[]) {
		let currentIndex = array.length;

		while (currentIndex != 0) {
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
		}
	}

	function generateCubes() {
		let currentColor: string = generateRandomHexColor();
		let newCubesArray: CubeType[];

		newCubesArray = Array(cubesQuantity).fill(null).map((_, index) => {
			currentColor = getDarkerColor(currentColor, 10)
			return {
				color: currentColor,
				order: index,
				chosenOrder: undefined
			}
		});

		shuffleArray(newCubesArray);
		
		return newCubesArray;
	}

	function restoreGame() {
		lostGame = undefined;
		withdrawCoins(10);
		newField();
		timerStopped = false;
	}

	function stopGame() {
		timerStopped = true;
		if (elapsed >= timer) {
			lostGame = 'timeIsOut';
		} else {
			lostGame = 'gameOver';
		}

		coins = Math.floor(score / 10);
		addCoins(coins);
		$gamesPlayed++;

		if ($gamesPlayed % 3 === 0 && $gamesPlayed > 2) {
			showInterstitialAds();
		}
	}

	function checkOrder() {
		for (let index = 0; index < cubes.length; index++) {
			if (cubes.length - 1 === index) {
				score++;
				newField();
				break;
			}

			if (cubes[index].chosenOrder === cubes[index].order) {
				score++;
				continue;
			}

			stopGame();
			break;
		}
	}

	function handleClick(cube: CubeType, index: number) {
		if (lostGame) {
			return;
		}

		if (cubes[index].chosenOrder === undefined) {
			cubes[index].chosenOrder = counter;
			counter++;
		} else if (cubes[index].chosenOrder === (counter - 1)) {
			cubes[index].chosenOrder = undefined;
			counter--;
		}

		if (counter === cubes.length) {
			checkOrder();
		}

		if (score > $maxScore.shadeOrder) {
			updateScore(score, Modes.shadeOrder)
		}
	}

	function newField() {
		elapsed = 0;
		counter = 0;

		if (score <= 10) {
			cubesQuantity = 3;
			timer = 10000;
		} else if (score <= 25 && score > 10) {
			cubesQuantity = 6;
			timer = 12000;
		} else if (score > 25 && score <= 60) {
			cubesQuantity = 9;
			timer = 15000;
		} else {
			cubesQuantity = 12;
			timer = 17000;
		}

		cubes = generateCubes();
	}

	$: {
		if (elapsed >= timer) {
			stopGame();
		}
	}

	function startNewGame() {
		lostGame = undefined;
		timerStopped = false;
		score = 0;
		newField();
	}
</script>

<div class="space-between space-xl max-width">
	<div class="line-blocks space">
		<img src="cup.svg" alt="cup" height="32" />
		<h3>{$maxScore.shadeOrder}</h3>
	</div>
	<Timer --width="150px" timer="{timer}" bind:elapsed="{elapsed}" timerStopped="{timerStopped}"/>
</div>
{#if score === 0}
	<span class="Rules">Mark the cubes in order from lightest to darkest.</span>
{:else}
	<h2 in:scale="{{duration: 200}}">Your score {score}</h2>
{/if}
<div class="Game" in:scale>
	{#each cubes as cube, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			style="background-color: {cube.color};"
			on:click={() => handleClick(cube, index)}
		>
			{#if cube.chosenOrder !== undefined}
				<h3>{cube.chosenOrder + 1}</h3>
			{/if}
		</div>
	{/each}
</div>

<PopUp
	score="{score}"
	lostGame="{lostGame}"
	startNewGame="{startNewGame}"
	bind:isGameOn="{isGameOn}"
	earnedCoins="{coins}"
	restoreGame="{restoreGame}"
/>

<style lang="scss">
	.Game {
		display: grid;
		width: 100%;
		max-width: 700px;
		gap: 16px;
		grid-template-columns: repeat(3, 1fr);

		div {
			width: 100%;
			aspect-ratio: 1;
			border-radius: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.Rules {
		text-align: center;
		padding: 0 32px;
	}
</style>