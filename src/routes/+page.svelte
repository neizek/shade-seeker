<script lang="ts">
	import Badge from "$lib/components/Badge.svelte";
	import Button from "$lib/components/Button.svelte";
	import Game from "$lib/components/Game.svelte";
	import { removeBanner, showBanner } from "$lib/stores/admob.js";
	import { coins } from "$lib/stores/coins.js";
	import { Modes } from "$lib/stores/modes.js";
	import { maxScore } from "$lib/stores/score.js";
	import { addLeadingZeros } from "$lib/utils/numbers.js";
	let isGameOn: boolean = false;
	let mode: Modes = Modes.thirdWheel;

	$: {
		if (isGameOn) {
			showBanner();
		} else {
			removeBanner();
		}
	}

	const games = [
		{ icon: 'rgb', label: 'Third Wheel', mode: Modes.thirdWheel},
		{ icon: 'order', label: 'Shade Order', mode: Modes.shadeOrder},
	];
</script>

{#if isGameOn}
	<Game mode="{mode}" bind:isGameOn="{isGameOn}" />
{:else}
	<div class="Menu vertical-flex space-xl">
		<img src="/logo.svg" alt="Logo" style="max-width: 300px"/>
		<div class="space-between space-xl max-width">
			<Badge label="{addLeadingZeros($maxScore[mode])}" icon="/cup.svg" labelTag="h2" />
			<Badge label="{addLeadingZeros($coins)}" icon="/coin.svg" labelTag="h2" />
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="ModeButtons max-width space-between space-l">
			{#each games as game}
				<div class="vertical-flex space" on:click={() => mode = game.mode}>
					<div
						class="ModeButton"
						class:active="{mode === game.mode}"
					>
						<img src="/{game.icon}.svg" alt="{game.label} mode" />
					</div>
					<span class="text-shadow text-center">{game.label}</span>
				</div>
			{/each}
		</div>
		<div class="max-width">
			<Button label="START" on:click="{() => isGameOn = true}">
				<img src="/play.svg" alt="Play" style="height: 32px; padding: 0 8px 0 4px;" />
			</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	.Menu {
		width: 100%;
		max-width: 400px;
		align-items: center;
	}

	.ModeButtons {
		> div {
			flex: 1;
		}
	}

	.ModeButton {
		padding: 4px;
		border-radius: 5%;
		background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
		transition: all .3 ease-out;
		filter: grayscale(100);

		&.active {
			filter: grayscale(0);
		}

		img {
			width: 100%;
			height: 100%;
			background-color: rgb(5, 6, 45);
			padding: 16px;
			border-radius: 5%;
		}
	}
</style>