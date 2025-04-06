<script>
	import { browser } from "$app/environment";
	import Background from "$lib/components/Background.svelte";
	import Dialog from "$lib/components/Dialog.svelte";
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
	<Dialog>
		<div class="absolute-center"> 
			<slot></slot>
		</div>
	</Dialog>
</Background>

<style lang="scss">
	.absolute-center {
		max-width: 800px;
		margin: 0 auto;
		flex: 1;
		padding: 32px;
		flex-direction: column;
		gap: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		justify-items: center;

		@media (min-width: 768px) {
			padding-bottom: 90px;
		}
	}
</style>