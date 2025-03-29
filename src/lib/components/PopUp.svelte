<script lang="ts">
	import { scale } from "svelte/transition";
	import Button from "./Button.svelte";
	export let gameOverText: string;
	export let startNewGame: () => void;
	export let restoreGame: () => void;
	export let score: number;
	export let isGameOn: boolean;
	export let earnedCoins: number;
	import { coins } from "$lib/stores/coins.js";
</script>

<div class="Lost vertical-flex space-l" transition:scale="{{duration: 100}}">
	<h1 style="text-align: center;">{gameOverText}</h1>
	<div class="Results space-between space">
		<span>Final score: {score}</span>
		{#if earnedCoins}
			<span> Coins earned: {earnedCoins} </span>
		{/if}
	</div>
	<div class="vertical-flex">
		<Button
			label="Try Again"
			on:click="{startNewGame}"
		/>
		{#if $coins > 10}
			<Button label="Continue for 10 Coins" on:click="{restoreGame}">
				<img src="/coin.svg" alt="Coin" class="Coin" />
			</Button>
		{/if}
		<Button label="Back to Home" on:click="{() => isGameOn = false}" />
	</div>
</div>

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
		box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
	}

	.Coin {
		height: 32px;
		padding: 0 8px 0 4px;
	}

	.Results {
		span {
			text-shadow: 1px 1px 2px #3c3c3c;
		}
	}
</style>