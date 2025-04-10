<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { updateScore, maxScore, gamesPlayed } from "$lib/stores/score.js";
	import { generateRandomHexColor, slightlyChangeHexColor } from "$lib/utils/colors.js";
	import { showInterstitialAds } from "$lib/stores/admob.js";
	import Timer from "../Timer.svelte";
	import { Modes } from "$lib/stores/modes.js";
	import PopUp from "../LostGame.svelte";
	import { addCoins, withdrawCoins } from "$lib/stores/coins.js";

	export let isGameOn: boolean;

	let fieldsQty: number;
	let cubes: number[];
	let lostGame: string | undefined = undefined;
	let randomNumber: number;
	let color: string;
	let score: number;
	let adjustmentLevel: number;
	let differentColor: string;
	let timer: number = 10000;
	let elapsed: number = 0;
	let timerStopped: boolean = false;
	let coins: number = 0;

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
			elapsed = 0;

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

			if (score > $maxScore.thirdWheel) {
				updateScore(score, Modes.thirdWheel)
			}
		} else {
			stopGame();
		}
	}

	function stopGame() {
		timerStopped = true;
		if (elapsed >= timer) {
			lostGame = 'timeIsOut';
		} else {
			lostGame = 'gameOver';
		}
		$gamesPlayed++;
		coins = Math.floor(score / 10);
		addCoins(coins);

		if ($gamesPlayed % 3 === 0 && $gamesPlayed > 2) {
			showInterstitialAds();
		}
	}

	$: {
		if (elapsed >= timer) {
			stopGame();
		}
	}

	function restoreGame() {
		withdrawCoins(10);
		lostGame = undefined;
		updateField(adjustmentLevel);
		timerStopped = false;
		elapsed = 0;
		timer = 10000;
	}

	function startNewGame() {
		elapsed = 0;
		timer = 10000;
		timerStopped = false;
		lostGame = undefined;
		score = 0;
		adjustmentLevel = 1;
		fieldsQty = 9;
		cubes = Array(fieldsQty);
		updateField(adjustmentLevel);
	}
</script>

<div class="space-between space-xl max-width">
	<div class="line-blocks space">
		<img src="cup.svg" alt="cup" height="32" />
		<h3>{$maxScore.thirdWheel}</h3>
	</div>
	<Timer --width="150px" timer="{timer}" bind:elapsed="{elapsed}" timerStopped="{timerStopped}"/>
</div>
{#if score === 0}
	<span class="Rules">Find the odd cube out</span>
{:else}
	<h2 in:scale="{{duration: 200}}">Your score {score}</h2>
{/if}
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

		div {
			width: 100%;
			aspect-ratio: 1;
			border-radius: 5%;
		}
	}

	.Rules {
		text-align: center;
		padding: 0 32px;
	}
</style>