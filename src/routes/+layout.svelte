<script>
	import { browser } from "$app/environment";
	import Background from "$lib/components/Background.svelte";
	import { initializeAds, requestTrackingPermission, showBanner } from "$lib/stores/admob.js";
	import { onMount } from "svelte";

	onMount(async () => {
		if (browser) {
			const status = await requestTrackingPermission();
			console.log('Tracking permission status:', status);
			
			initializeAds();
		}
	});
</script>

<Background>
	<div class="absolute-center"> 
		<slot></slot>
	</div>
</Background>

<style lang="scss">
	.absolute-center {
		flex: 1;
		padding: 32px;
		flex-direction: column;
		gap: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		justify-items: center;
	}
</style>