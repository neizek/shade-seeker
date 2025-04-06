<script lang="ts">
	export let icon: string;
	export let label: string | number;
	export let labelTag: string = 'h3';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="line-blocks space-l" on:click>
	<img src="{icon}" alt="cup" height="32" />
	<svelte:element this="{labelTag}">{label}</svelte:element>
</div>