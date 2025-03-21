<script lang="ts">
	import { onMount } from 'svelte';

	export let timer: number = 60000;
	export let elapsed = 0;
	export let timerStopped: boolean = false;
	$: duration = timer;

	$: {
		if (!timerStopped) startCounting();
	}

	function startCounting() {
		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			if (timerStopped) {
				return;
			}
			frame = requestAnimationFrame(update);

			elapsed += Math.min(time - last_time, duration - elapsed);
			last_time = time;
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	}

	onMount(() => {
		startCounting();
	});
</script>

<progress class="Timer" value={elapsed / duration}></progress>

<style lang="scss">
	.Timer {
		width: var(--width, 100%);
		height: 16px;
		// background-color: white;
		border-radius: 16px;
		border: 3px solid;
		overflow: hidden;
	}

	// .Fill {
	// 	height: 100%;
	// 	background-color: #93b3ff;
	// }
</style>