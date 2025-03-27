<script lang="ts">
	import { Modes } from "$lib/stores/modes.js";
	import ShadeOrder from "./Games/ShadeOrder.svelte";
	import ThirdWheel from "./Games/ThirdWheel.svelte";

	export let mode: string;
	export let isGameOn: boolean;
</script>

<svelte:component
	this="{mode === Modes.thirdWheel ? ThirdWheel : ShadeOrder}"
	bind:isGameOn="{isGameOn}"
>
</svelte:component>
