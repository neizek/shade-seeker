<script>
	import Background from "$lib/components/Background.svelte";
</script>

<Background>
	<div class="absolute-center"> 
		<slot></slot>
	</div>
</Background>

<style lang="scss">
	.absolute-center {
		flex: 1;
		// height: 100vh;
		// padding: 16px;
		padding: 32px;
		flex-direction: column;
		gap: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		justify-items: center;
	}
</style>