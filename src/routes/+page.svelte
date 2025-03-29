<script lang="ts">
	import Badge from "$lib/components/Badge.svelte";
import Button from "$lib/components/Button.svelte";
	import Game from "$lib/components/Game.svelte";
	import { hideBanner, resumeBanner, showBanner } from "$lib/stores/admob.js";
	import { coins } from "$lib/stores/coins.js";
	import { Modes } from "$lib/stores/modes.js";
	import { maxScore } from "$lib/stores/score.js";
	import { addLeadingZeros } from "$lib/utils/numbers.js";
	import { onMount } from "svelte";
	let isGameOn: boolean = false;
	let mode: Modes = Modes.thirdWheel;

	$: {
		if (isGameOn) {
			hideBanner();
		} else {
			resumeBanner();
		}
	}

	onMount(() => {
		showBanner();
	});

	// $: console.log($coins)
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
			<div
				class="ModeButton"
				class:active="{mode === Modes.thirdWheel}"
				on:click={() => mode = Modes.thirdWheel}
			>
				<div class="vertical-flex space">
					<img src="/rgb.svg" alt="Odd mode" />
					<span>Third Wheel</span>
				</div>
			</div>
			<div
				class="ModeButton"
				class:active="{mode === Modes.shadeOrder}"
				on:click={() => mode = Modes.shadeOrder}
			>
				<div class="vertical-flex space">
					<img src="/order.svg" alt="Order mode" />
					<span>Shade Order</span>
				</div>
			</div>
			<!-- <Button label="Odd mode" img="/order.svg"></Button>
			<Button label="Order mode" img="/rgb.svg"></Button> -->
		</div>
		<div class="max-width">
			<Button label="START" on:click="{() => isGameOn = true}"/>
		</div>
	</div>
{/if}

<style lang="scss">
	.Menu {
		width: auto;
		max-width: 400px;
		align-items: center;
	}

	.ModeButtons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.ModeButton {
		padding: 4px;
		display: flex;
		aspect-ratio: 1;
		border-radius: 5%;
		background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
		transition: all .3 ease-out;
		filter: grayscale(100);

		&.active {
			filter: grayscale(0);
		}

		div {
			display: flex;
			background-color: rgb(5, 6, 45);
			padding: 8px 16px;
			border-radius: 5%;
			width: 100%;
			height: 100%;

			img {
				width: inherit;
			}

			span {
				text-align: center;
				font-size: 14px;
				text-overflow: ellipsis; 
				overflow: hidden; 
				white-space: nowrap;
			}
		}
	}
</style>