<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Game from "$lib/components/Game.svelte";
	import { banner } from "$lib/stores/admob.js";
	import { maxScore } from "$lib/stores/score.js";
	let isGameOn: boolean = false;

	banner();
</script>
{#if isGameOn}
	<Game bind:isGameOn="{isGameOn}" />
{:else}
	<div class="Menu vertical-flex space-l">
		<img src="/logo.svg" alt="Logo" style="max-width: 300px"/>
		<h2>Score: {$maxScore}</h2>
		<div style="width: 90%">
			<Button label="START" on:click="{() => isGameOn = true}"/>
		</div>
		<div class="Banner">

		</div>
	</div>
{/if}

<style lang="scss">
	.Menu {
		width: 100%;
		max-width: 400px;
		align-items: center;
	}
</style>