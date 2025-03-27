<script lang="ts">
	export let icon: string;
	export let label: string | number;
	export let labelTag: string = 'h3';
</script>

<div class="line-blocks space-l">
	<img src="{icon}" alt="cup" height="32" />
	<svelte:element this="{labelTag}">{label}</svelte:element>
</div>