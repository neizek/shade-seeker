<script lang="ts">
	import { scale } from "svelte/transition";
	import Button from "./Button.svelte";
	import { updateScore, maxScore } from "$lib/stores/score.js";
	import Timer from "./Timer.svelte";

	export let isGameOn: boolean;
	// let fieldsQty = 9;
	// let cubes = Array(fieldsQty)
	// let lostGame: boolean = false;
	// let randomNumber = getRandomNumber(0, fieldsQty);
	// let color: string = generateRandomHexColor();
	// let score: number = 0;
	// let adjustmentLevel = 5;
	// let differentColor = slightlyChangeHexColor(color, adjustmentLevel);
	// let timer = 60000;

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

	startNewGame();

	function generateRandomHexColor() {
		const hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
		let code = "";
		
		for (let i = 0; i < 6; i++) {
			code += hexArray[Math.floor(Math.random() * 16)];
		}
		
		return `#${code}`;
	}

	function getRandomNumber(min: number = 0, max: number) {
		max--;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function slightlyChangeHexColor(hexColor: string, adjustmentLevel: number) {
		// Remove the '#' from the hex color if it exists
		hexColor = hexColor.replace(/^#/, '');

		// Ensure the hex color is valid (6 characters long)
		if (hexColor.length !== 6) {
			throw new Error('Invalid hex color');
		}

		// Convert hex to RGB
		let r = parseInt(hexColor.slice(0, 2), 16);
		let g = parseInt(hexColor.slice(2, 4), 16);
		let b = parseInt(hexColor.slice(4, 6), 16);

		// Calculate the maximum change based on the adjustment level
		// Level 0 allows for a change of up to 128 (half of 255), and level 10 allows for a change of up to 2
		const maxChange = Math.floor(128 - ((128 - 2) * adjustmentLevel / 10));

		// Randomly adjust RGB values within the calculated range
		r = Math.min(Math.max(r + Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange, 0), 255);
		g = Math.min(Math.max(g + Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange, 0), 255);
		b = Math.min(Math.max(b + Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange, 0), 255);

		// Convert RGB back to hex
		function componentToHex(c: number) {
			const hex = c.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}

		return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
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
			
			if (score > 5) {
				adjustmentLevel = 6;
			} else if (score > 15) {
				adjustmentLevel = 7;
			} else if (score > 25) {
				adjustmentLevel = 8;
			} else if (score > 35) {
				adjustmentLevel = 9;
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
	}

	$: {
		if (elapsed >= timer) {
			stopGame();
		}
	}

	function startNewGame() {
		elapsed = 0;
		timerStopped = false;
		lostGame = false;
		score = 0;
		adjustmentLevel = 5;
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
	<!-- <input type="range" min="{0}" max="{6000}" value="{timer}" /> -->
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
		<h1 style="text-align: center;">Game Over</h1>
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
		max-width: 90%;
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
			border-radius: 16px;
		}
	}

</style>