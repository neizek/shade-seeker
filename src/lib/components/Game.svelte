<script lang="ts">
	import { scale } from "svelte/transition";
	import Button from "./Button.svelte";
	import { updateScore, maxScore, gamesPlayed } from "$lib/stores/score.js";
	import Timer from "./Timer.svelte";
	import { generateRandomHexColor, slightlyChangeHexColor } from "$lib/utils/colors.js";
	import { showInterstitialAds } from "$lib/stores/admob.js";

	export let isGameOn: boolean;

	let fieldsQty: number;
	let cubes: number[];
	let lostGame: boolean;
	let randomNumber: number;
	let color: string;
	let score: number;
	let adjustmentLevel: number;
	let differentColor: string;
	let timer: number = 60000;
	let elapsed: number = 0;
	let timerStopped: boolean = false;
	let gameOverText: string = 'Game Over';

	startNewGame();

	function getRandomNumber(min: number = 0, max: number) {
		max--;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function updateField(adjustmentLevel: number) {
		randomNumber = getRandomNumber(0, 9);
		color = generateRandomHexColor();
		differentColor = slightlyChangeHexColor(color, adjustmentLevel)
	}
	
	function handleChose (isCorrect: boolean) {
		if (isCorrect && !lostGame) {
			if (score === 9 && fieldsQty === 9) {
				fieldsQty = 16;
				cubes = Array(fieldsQty);
			} else if (score === 19 && fieldsQty === 16) {
				fieldsQty = 25;
				cubes = Array(fieldsQty);
			}
			
			if (score > 5 && score <= 15) {
				adjustmentLevel = 2;
			} else if (score > 15 && score <= 25) {
				adjustmentLevel = 3;
			} else if (score > 25 && score <= 40) {
				adjustmentLevel = 4;
			} else if (score > 40) {
				adjustmentLevel = 5;
			}

			updateField(adjustmentLevel);
			score++;

			if (score > $maxScore) {
				updateScore(score)
			}
		} else {
			stopGame();
		}
	}

	function stopGame() {
		lostGame = true;
		timerStopped = true;
		if (elapsed >= timer) {
			gameOverText = "Time is out"
		} else {
			gameOverText = "Game Over"
		}
		$gamesPlayed++;
	}

	$: {
		if (elapsed >= timer) {
			stopGame();
		}
	}

	function startNewGame() {
		if ($gamesPlayed % 3 === 0 && $gamesPlayed > 2) {
			showInterstitialAds();
		}

		elapsed = 0;
		timerStopped = false;
		lostGame = false;
		score = 0;
		adjustmentLevel = 1;
		fieldsQty = 9;
		cubes = Array(fieldsQty);
		updateField(adjustmentLevel);
	}
</script>

<div class="space-between max-width">
	<div class="line-blocks space-l">
		<img src="cup.svg" alt="cup" height="32" />
		<h3>{$maxScore}</h3>
	</div>
	<Timer --width="200px" timer="{timer}" bind:elapsed="{elapsed}" timerStopped="{timerStopped}"/>
</div>
<h2>Your score {score}</h2>
<div class="Game" in:scale style="grid-template-columns: repeat({Math.sqrt(fieldsQty)}, 1fr);">
	{#each cubes as cube, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			style="background-color: {randomNumber === index ? differentColor : color}"
			on:click={() => handleChose(randomNumber === index)}
		>
		</div>
	{/each}
</div>
{#if lostGame}
	<div class="Lost vertical-flex space-l" in:scale="{{duration: 100}}">
		<h1 style="text-align: center;">{gameOverText}</h1>
		<div style="vertical-flex">
			<span> Your final score: {score}</span>
		</div>
		<div class="vertical-flex">
			<Button
				label="TRY AGAIN"
				on:click="{startNewGame}"
			/>
			<Button label="BACK TO HOME" on:click="{() => isGameOn = false}" />
		</div>
	</div>
{/if}

<style lang="scss">
	.Lost {
		position: fixed;
		width: 90%;
		max-width: 400px;
		width: 80%;
		margin: 0 auto;
		z-index: 100;
		height: auto;
		backdrop-filter: blur(16px) saturate(180%);
		border-radius: 16px;
		padding: 20px;
	}

	.Game {
		display: grid;
		width: 100%;
		max-width: 700px;
		gap: 16px;

		div {
			width: 100%;
			aspect-ratio: 1;
			border-radius: 5%;
		}
	}

</style>